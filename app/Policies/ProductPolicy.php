<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;

class ProductPolicy
{
    public function manage(User $user)
    {
        return $user->role === 'gerant';
    }

    public function view(User $user, Product $product)
    {
        return true;
    }
}
