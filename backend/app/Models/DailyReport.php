<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyReport extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'report_date',
        'total_vehicles',
        'total_motorcycle',
        'total_car',
        'total_revenue',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'report_date' => 'date',
        'total_vehicles' => 'integer',
        'total_motorcycle' => 'integer',
        'total_car' => 'integer',
        'total_revenue' => 'integer',
    ];

    /**
     * Get or create daily report for a specific date
     *
     * @param string $date
     * @return DailyReport
     */
    public static function getOrCreateForDate(string $date): DailyReport
    {
        return self::firstOrCreate(
            ['report_date' => $date],
            [
                'total_vehicles' => 0,
                'total_motorcycle' => 0,
                'total_car' => 0,
                'total_revenue' => 0,
            ]
        );
    }
}
