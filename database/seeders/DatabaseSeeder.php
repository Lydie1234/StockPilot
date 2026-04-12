<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'gerant@stockpilot.test'],
            [
                'name' => 'Gerant Demo',
                'password' => 'password',
                'role' => 'gerant',
                'email_verified_at' => now(),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'employe@stockpilot.test'],
            [
                'name' => 'Employe Demo',
                'password' => 'password',
                'role' => 'employe',
                'email_verified_at' => now(),
            ]
        );
    }
}
