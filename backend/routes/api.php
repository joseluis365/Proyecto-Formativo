<?php

use App\Http\Controllers\Api\UserController;

Route::get('/usuarios', [UserController::class, 'index']);
Route::post('/usuarios', [UserController::class, 'store']);
Route::get('/usuarios/{documento}', [UserController::class, 'show']);
Route::put('/usuarios/{documento}', [UserController::class, 'update']);
Route::delete('/usuarios/{documento}', [UserController::class, 'destroy']);
