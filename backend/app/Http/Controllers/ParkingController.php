<?php

namespace App\Http\Controllers;

use App\Models\ParkingTransaction;
use App\Models\ParkingRate;
use App\Models\DailyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ParkingController extends Controller
{
    /**
     * Check-in kendaraan (masuk parkir)
     */
    public function checkIn(Request $request)
    {
        $request->validate([
            'license_plate' => 'required|string|max:20',
            'vehicle_type' => 'required|in:car,motorcycle',
        ]);

        // Generate unique ticket number
        $date = now()->format('Ymd');
        $lastTicket = ParkingTransaction::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();
        
        $sequence = $lastTicket ? intval(substr($lastTicket->ticket_number, -3)) + 1 : 1;
        $ticketNumber = 'PRK' . $date . str_pad($sequence, 3, '0', STR_PAD_LEFT);

        // Generate unique QR code
        $qrCode = Str::random(32);

        // Create transaction
        $transaction = ParkingTransaction::create([
            'ticket_number' => $ticketNumber,
            'license_plate' => strtoupper($request->license_plate),
            'vehicle_type' => $request->vehicle_type,
            'qr_code' => $qrCode,
            'entry_time' => now(),
            'status' => 'active',
            'operator_in_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Check-in successful',
            'transaction' => [
                'id' => $transaction->id,
                'ticket_number' => $transaction->ticket_number,
                'license_plate' => $transaction->license_plate,
                'vehicle_type' => $transaction->vehicle_type,
                'qr_code' => $transaction->qr_code,
                'entry_time' => $transaction->entry_time->format('Y-m-d H:i:s'),
            ],
        ], 201);
    }

    /**
     * Scan QR untuk preview sebelum checkout
     */
    public function scanQR($qrCode)
    {
        $transaction = ParkingTransaction::where('qr_code', $qrCode)
            ->where('status', 'active')
            ->with(['operatorIn'])
            ->first();

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found or already completed',
            ], 404);
        }

        // Calculate duration and fee
        $duration = now()->diffInMinutes($transaction->entry_time);
        $rate = ParkingRate::where('vehicle_type', $transaction->vehicle_type)->first();
        
        $estimatedFee = $rate ? $rate->calculateFee($duration) : 0;

        return response()->json([
            'transaction' => [
                'id' => $transaction->id,
                'ticket_number' => $transaction->ticket_number,
                'license_plate' => $transaction->license_plate,
                'vehicle_type' => $transaction->vehicle_type,
                'entry_time' => $transaction->entry_time->format('Y-m-d H:i:s'),
                'duration_minutes' => $duration,
                'estimated_fee' => $estimatedFee,
                'operator_in' => $transaction->operatorIn->name,
            ],
        ]);
    }

    /**
     * Check-out kendaraan (keluar parkir)
     */
    public function checkOut(Request $request, $qrCode)
    {
        $request->validate([
            'payment_method' => 'required|in:cash,qris,e-wallet,debit,credit',
            'notes' => 'nullable|string',
        ]);

        $transaction = ParkingTransaction::where('qr_code', $qrCode)
            ->where('status', 'active')
            ->first();

        if (!$transaction) {
            return response()->json([
                'message' => 'Transaction not found or already completed',
            ], 404);
        }

        // Calculate duration and fee
        $exitTime = now();
        $duration = $exitTime->diffInMinutes($transaction->entry_time);
        
        $rate = ParkingRate::where('vehicle_type', $transaction->vehicle_type)->first();
        
        if (!$rate) {
            return response()->json([
                'message' => 'Parking rate not found for ' . $transaction->vehicle_type,
            ], 404);
        }

        $totalFee = $rate->calculateFee($duration);

        // Update transaction
        $transaction->update([
            'exit_time' => $exitTime,
            'duration_minutes' => $duration,
            'total_fee' => $totalFee,
            'status' => 'completed',
            'operator_out_id' => $request->user()->id,
            'payment_method' => $request->payment_method,
            'notes' => $request->notes,
        ]);

        // Update daily report
        $this->updateDailyReport($transaction);

        return response()->json([
            'message' => 'Check-out successful',
            'transaction' => [
                'id' => $transaction->id,
                'ticket_number' => $transaction->ticket_number,
                'license_plate' => $transaction->license_plate,
                'vehicle_type' => $transaction->vehicle_type,
                'entry_time' => $transaction->entry_time->format('Y-m-d H:i:s'),
                'exit_time' => $transaction->exit_time->format('Y-m-d H:i:s'),
                'duration_minutes' => $transaction->duration_minutes,
                'total_fee' => $transaction->total_fee,
                'payment_method' => $transaction->payment_method,
            ],
        ]);
    }

    /**
     * Get active vehicles (masih parkir)
     */
    public function activeVehicles(Request $request)
    {
        $transactions = ParkingTransaction::where('status', 'active')
            ->with(['operatorIn'])
            ->orderBy('entry_time', 'desc')
            ->get()
            ->map(function ($transaction) {
                $duration = now()->diffInMinutes($transaction->entry_time);
                return [
                    'id' => $transaction->id,
                    'ticket_number' => $transaction->ticket_number,
                    'license_plate' => $transaction->license_plate,
                    'vehicle_type' => $transaction->vehicle_type,
                    'entry_time' => $transaction->entry_time->format('Y-m-d H:i:s'),
                    'duration_minutes' => $duration,
                    'operator_in' => $transaction->operatorIn->name,
                ];
            });

        return response()->json([
            'total' => $transactions->count(),
            'transactions' => $transactions,
        ]);
    }

    /**
     * Get transaction history
     */
    public function history(Request $request)
    {
        $query = ParkingTransaction::with(['operatorIn', 'operatorOut'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('entry_time', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('entry_time', '<=', $request->end_date);
        }

        $transactions = $query->paginate(20);

        return response()->json($transactions);
    }

    /**
     * Get single transaction
     */
    public function getTransaction($id)
    {
        $transaction = ParkingTransaction::with(['operatorIn', 'operatorOut'])
            ->findOrFail($id);

        return response()->json([
            'transaction' => $transaction,
        ]);
    }

    /**
     * Update daily report
     */
    private function updateDailyReport(ParkingTransaction $transaction)
    {
        $date = $transaction->exit_time->format('Y-m-d');
        $report = DailyReport::getOrCreateForDate($date);

        $report->increment('total_vehicles');
        
        if ($transaction->vehicle_type === 'motorcycle') {
            $report->increment('total_motorcycle');
        } else {
            $report->increment('total_car');
        }
        
        $report->increment('total_revenue', $transaction->total_fee);
    }
}

