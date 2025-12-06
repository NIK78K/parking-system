<?php

namespace App\Http\Controllers;

use App\Models\DailyReport;
use App\Models\ParkingTransaction;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Get daily reports
     */
    public function daily(Request $request)
    {
        $query = DailyReport::orderBy('report_date', 'desc');

        if ($request->has('start_date')) {
            $query->whereDate('report_date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('report_date', '<=', $request->end_date);
        }

        $reports = $query->paginate(30);

        return response()->json($reports);
    }

    /**
     * Get monthly reports
     */
    public function monthly(Request $request)
    {
        $year = $request->input('year', now()->year);

        $monthlyData = DailyReport::selectRaw('
                MONTH(report_date) as month,
                SUM(total_vehicles) as total_vehicles,
                SUM(total_motorcycle) as total_motorcycle,
                SUM(total_car) as total_car,
                SUM(total_revenue) as total_revenue
            ')
            ->whereYear('report_date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'year' => $year,
            'monthly_reports' => $monthlyData,
        ]);
    }

    /**
     * Export report (placeholder)
     */
    public function export(Request $request)
    {
        // TODO: Implement Excel/PDF export
        return response()->json([
            'message' => 'Export feature coming soon',
        ]);
    }
}
