<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingTransaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ticket_number',
        'license_plate',
        'vehicle_type',
        'qr_code',
        'entry_time',
        'exit_time',
        'duration_minutes',
        'total_fee',
        'status',
        'operator_in_id',
        'operator_out_id',
        'payment_method',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'entry_time' => 'datetime',
        'exit_time' => 'datetime',
        'duration_minutes' => 'integer',
        'total_fee' => 'integer',
    ];

    /**
     * Operator who handled check-in
     */
    public function operatorIn()
    {
        return $this->belongsTo(User::class, 'operator_in_id');
    }

    /**
     * Operator who handled check-out
     */
    public function operatorOut()
    {
        return $this->belongsTo(User::class, 'operator_out_id');
    }

    /**
     * Check if transaction is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if transaction is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
