<?php

namespace App\Http\Controllers;

use App\Models\ParkingRate;
use Illuminate\Http\Request;

class RateController extends Controller
{
    /**
     * Get all parking rates
     */
    public function index()
    {
        $rates = ParkingRate::all();
        return response()->json(['rates' => $rates]);
    }

    /**
     * Get single rate
     */
    public function show($id)
    {
        $rate = ParkingRate::findOrFail($id);
        return response()->json(['rate' => $rate]);
    }

    /**
     * Update parking rate
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'first_hour_rate' => 'required|integer|min:0',
            'next_hour_rate' => 'required|integer|min:0',
            'daily_max_rate' => 'nullable|integer|min:0',
        ]);

        $rate = ParkingRate::findOrFail($id);
        $rate->update($request->only(['first_hour_rate', 'next_hour_rate', 'daily_max_rate']));

        return response()->json([
            'message' => 'Parking rate updated successfully',
            'rate' => $rate,
        ]);
    }
}
