<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParkingRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tarif untuk Mobil (Default)
        DB::table('parking_rates')->insert([
            'vehicle_type' => 'car',
            'first_hour_rate' => 5000, // Rp 5.000 untuk jam pertama
            'next_hour_rate' => 3000,  // Rp 3.000 untuk jam berikutnya
            'daily_max_rate' => 50000, // Maksimal Rp 50.000 per hari
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Tarif untuk Motor (Default)
        DB::table('parking_rates')->insert([
            'vehicle_type' => 'motorcycle',
            'first_hour_rate' => 3000, // Rp 3.000 untuk jam pertama
            'next_hour_rate' => 2000,  // Rp 2.000 untuk jam berikutnya
            'daily_max_rate' => 30000, // Maksimal Rp 30.000 per hari
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('✅ Default parking rates seeded successfully!');
    }
}