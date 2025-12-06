<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParkingController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Optional for testing

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Parking Operations (Operator & Admin)
    Route::prefix('parking')->group(function () {
        Route::post('/check-in', [ParkingController::class, 'checkIn']);
        Route::post('/check-out', [ParkingController::class, 'checkOut']);
        Route::get('/active', [ParkingController::class, 'activeVehicles']);
        Route::get('/scan/{qrCode}', [ParkingController::class, 'scanQR']);
        Route::get('/history', [ParkingController::class, 'history']);
        Route::get('/transaction/{id}', [ParkingController::class, 'getTransaction']);
    });
    
    // Dashboard Stats (All authenticated users)
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // Admin Only Routes
    Route::middleware('admin')->group(function () {
        // Rates Management
        Route::prefix('rates')->group(function () {
            Route::get('/', [RateController::class, 'index']);
            Route::get('/{id}', [RateController::class, 'show']);
            Route::put('/{id}', [RateController::class, 'update']);
        });
        
        // Reports
        Route::prefix('reports')->group(function () {
            Route::get('/daily', [ReportController::class, 'daily']);
            Route::get('/monthly', [ReportController::class, 'monthly']);
            Route::get('/export', [ReportController::class, 'export']);
        });
    });
});
