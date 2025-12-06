<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parking_rates', function (Blueprint $table) {
            $table->id();
            $table->enum('vehicle_type', ['car', 'motorcycle'])->unique();
            $table->integer('first_hour_rate'); // tarif jam pertama
            $table->integer('next_hour_rate'); // tarif jam berikutnya
            $table->integer('daily_max_rate')->nullable(); // tarif maksimal per hari
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_rates');
    }
};
