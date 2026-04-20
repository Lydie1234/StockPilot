<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed non-destructif: conserve les données existantes.
        User::query()->updateOrCreate(
            ['email' => 'gerant@stockpilot.test'],
            [
                'name' => 'Gerant Demo',
                'password' => Hash::make('password'),
                'role' => 'gerant',
                'email_verified_at' => now(),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'employe@stockpilot.test'],
            [
                'name' => 'Employe Demo',
                'password' => Hash::make('password'),
                'role' => 'employe',
                'email_verified_at' => now(),
            ]
        );
    }
}

