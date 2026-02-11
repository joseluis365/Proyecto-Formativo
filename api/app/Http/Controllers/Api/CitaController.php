<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Cita;    
use App\Http\Controllers\Controller;

class CitaController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Citas obtenidas correctamente',
            'data' => Cita::all()
        ]);
    }
}
