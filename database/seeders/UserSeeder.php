<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Gérant',
            'email' => 'gerant@stockpilot.com',
            'password' => Hash::make('password'),
            'role' => 'gerant',
        ]);
        User::create([
            'name' => 'Employé',
            'email' => 'employe@stockpilot.com',
            'password' => Hash::make('password'),
            'role' => 'employe',
        ]);
    }
}
