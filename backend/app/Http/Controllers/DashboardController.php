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
        ]);
    }
}
