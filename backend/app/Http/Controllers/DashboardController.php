<?php

namespace App\Http\Controllers;

use App\Models\ParkingTransaction;
use App\Models\DailyReport;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(Request $request)
    {
        $today = today();

        // Active vehicles
        $activeVehicles = ParkingTransaction::where('status', 'active')->count();
        $activeMotorcycles = ParkingTransaction::where('status', 'active')
            ->where('vehicle_type', 'motorcycle')->count();
        $activeCars = ParkingTransaction::where('status', 'active')
            ->where('vehicle_type', 'car')->count();

        // Today's stats
        $todayReport = DailyReport::where('report_date', $today)->first();
        $todayRevenue = $todayReport ? $todayReport->total_revenue : 0;
        $todayVehicles = $todayReport ? $todayReport->total_vehicles : 0;

        // This month stats
        $monthlyRevenue = DailyReport::whereYear('report_date', $today->year)
            ->whereMonth('report_date', $today->month)
            ->sum('total_revenue');

        // Recent activity (last 5 active vehicles)
        $recentActivity = ParkingTransaction::where('status', 'active')
            ->with('operatorIn')
            ->orderBy('entry_time', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                $entryTime = $transaction->entry_time;
                $now = now();
                $duration = (int) $entryTime->diffInMinutes($now);
                
                return [
                    'id' => $transaction->id,
                    'license_plate' => $transaction->license_plate,
                    'vehicle_type' => $transaction->vehicle_type,
                    'entry_time' => $entryTime->format('H:i'),
                    'duration_minutes' => $duration,
                ];
            });

        // Available slots (example: total 100 slots)
        $totalSlots = 100;
        $availableSlots = $totalSlots - $activeVehicles;

        return response()->json([
            'active_vehicles' => [
                'total' => $activeVehicles,
                'motorcycle' => $activeMotorcycles,
                'car' => $activeCars,
            ],
            'today' => [
                'revenue' => $todayRevenue,
                'vehicles' => $todayVehicles,
            ],
            'monthly_revenue' => $monthlyRevenue,
            'recent_activity' => $recentActivity,
            'available_slots' => $availableSlots,
            'total_slots' => $totalSlots,
        ]);
    }
}
