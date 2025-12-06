<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParkingRate extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vehicle_type',
        'first_hour_rate',
        'next_hour_rate',
        'daily_max_rate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'first_hour_rate' => 'integer',
        'next_hour_rate' => 'integer',
        'daily_max_rate' => 'integer',
    ];

    /**
     * Calculate parking fee based on duration
     *
     * @param int $durationMinutes
     * @return int
     */
    public function calculateFee(int $durationMinutes): int
    {
        $hours = ceil($durationMinutes / 60);
        
        if ($hours <= 1) {
            return $this->first_hour_rate;
        }
        
        $fee = $this->first_hour_rate + (($hours - 1) * $this->next_hour_rate);
        
        // Apply daily max if set
        if ($this->daily_max_rate && $fee > $this->daily_max_rate) {
            return $this->daily_max_rate;
        }
        
        return $fee;
    }
}
