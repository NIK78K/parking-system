<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@parking.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Operator 1
        User::create([
            'name' => 'John Operator',
            'email' => 'operator1@parking.com',
            'password' => Hash::make('password123'),
            'role' => 'operator',
        ]);

        // Operator 2
        User::create([
            'name' => 'Jane Operator',
            'email' => 'operator2@parking.com',
            'password' => Hash::make('password123'),
            'role' => 'operator',
        ]);

        $this->command->info('✅ Users seeded successfully!');
        $this->command->info('👤 Admin: admin@parking.com / password123');
        $this->command->info('👤 Operator 1: operator1@parking.com / password123');
        $this->command->info('👤 Operator 2: operator2@parking.com / password123');
    }
}