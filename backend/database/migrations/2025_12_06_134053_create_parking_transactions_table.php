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
        Schema::create('parking_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique(); // contoh: PRK20241206001
            $table->string('license_plate'); // nomor plat kendaraan
            $table->enum('vehicle_type', ['car', 'motorcycle']);
            $table->string('qr_code')->unique(); // unique string untuk QR code
            $table->timestamp('entry_time'); // waktu masuk
            $table->timestamp('exit_time')->nullable(); // waktu keluar
            $table->integer('duration_minutes')->nullable(); // durasi dalam menit
            $table->integer('total_fee')->nullable(); // total biaya parkir
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->foreignId('operator_in_id')->constrained('users'); // operator yang check-in
            $table->foreignId('operator_out_id')->nullable()->constrained('users'); // operator yang check-out
            $table->enum('payment_method', ['cash', 'qris', 'e-wallet', 'debit', 'credit'])->nullable();
            $table->text('notes')->nullable(); // catatan tambahan
            $table->timestamps();

            // Indexes untuk performa query
            $table->index('status');
            $table->index('entry_time');
            $table->index('license_plate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_transactions');
    }
};