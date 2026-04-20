<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
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
