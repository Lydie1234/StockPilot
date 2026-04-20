<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Afficher la liste de tous les utilisateurs (gérant seulement)
     */
    public function index()
    {
        $this->authorize('gerant');

        return User::select('id', 'name', 'email', 'phone', 'role', 'email_verified_at', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Créer un nouvel utilisateur (gérant seulement)
     * Le mot de passe par défaut est "password"
     */
    public function store(Request $request)
    {
        $this->authorize('gerant');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'role' => ['required', Rule::in(['gerant', 'employe'])],
        ]);

        // Créer l'utilisateur avec le mot de passe par défaut "password"
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'password' => Hash::make('password'),
            'email_verified_at' => now(), // Marquer l'email comme vérifié automatiquement
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'message' => "Utilisateur créé avec succès. Mot de passe par défaut : 'password'",
        ], 201);
    }

    /**
     * Afficher un utilisateur
     */
    public function show(User $user)
    {
        return $user->only('id', 'name', 'email', 'role', 'email_verified_at', 'created_at');
    }

    /**
     * Mettre à jour un utilisateur (gérant seulement)
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('gerant');

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'sometimes|nullable|string|max:20',
            'role' => ['sometimes', 'required', Rule::in(['gerant', 'employe'])],
            'password' => 'sometimes|nullable|string|min:8',
        ]);

        // Ne pas autoriser l'utilisateur à modifier sa propre adresse email ou son rôle s'il n'est pas propriétaire
        if (Auth::id() !== $user->id && Auth::user()->role !== 'admin') {
            unset($validated['email'], $validated['role']);
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'message' => 'Utilisateur mis à jour avec succès.',
        ]);
    }

    /**
     * Supprimer un utilisateur (gérant seulement)
     */
    public function destroy(User $user)
    {
        $this->authorize('gerant');

        // Empêcher de supprimer le dernier gérant
        if ($user->role === 'gerant' && User::where('role', 'gerant')->count() === 1) {
            return response()->json([
                'error' => 'Impossible de supprimer le dernier gérant.',
            ], 422);
        }

        // Empêcher de se supprimer soi-même
        if (Auth::id() === $user->id) {
            return response()->json([
                'error' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }

    /**
     * Réinitialiser le mot de passe d'un utilisateur à "password" (gérant seulement)
     */
    public function resetPassword(Request $request, User $user)
    {
        $this->authorize('gerant');

        $user->update([
            'password' => Hash::make('password'),
        ]);

        return response()->json([
            'message' => "Le mot de passe de {$user->name} a été réinitialisé à 'password'.",
        ]);
    }
}
