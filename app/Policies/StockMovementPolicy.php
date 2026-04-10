<?php

namespace App\Policies;

use App\Models\User;
use App\Models\StockMovement;

class StockMovementPolicy
{
    public function create(User $user)
    {
        return in_array($user->role, ['gerant', 'employe']);
    }

    public function view(User $user, StockMovement $movement)
    {
        return $user->id === $movement->user_id || $user->role === 'gerant';
    }
}
