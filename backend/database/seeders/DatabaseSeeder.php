<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');
        $this->command->newLine();

        $this->call([
            UserSeeder::class,
            ParkingRateSeeder::class,
            // ParkingTransactionSeeder::class, // Uncomment if you want sample data
        ]);

        $this->command->newLine();
        $this->command->info('🎉 Database seeding completed successfully!');
        $this->command->newLine();
        $this->command->info('📝 Login Credentials:');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('👑 Admin:');
        $this->command->info('   Email: admin@parking.com');
        $this->command->info('   Password: password123');
        $this->command->newLine();
        $this->command->info('👤 Operator 1:');
        $this->command->info('   Email: operator1@parking.com');
        $this->command->info('   Password: password123');
        $this->command->newLine();
        $this->command->info('👤 Operator 2:');
        $this->command->info('   Email: operator2@parking.com');
        $this->command->info('   Password: password123');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->newLine();
        $this->command->info('💡 Database is ready with clean data (no sample transactions)');
        $this->command->info('   Start using the app to create your first parking transaction!');
    }
}