<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;

class TipoDocumentoController extends Controller
{
    /**
     * Display a listing of active document types.
     */
    public function index()
    {
        // 1 refers to "Activo" state
        $tiposDocumento = TipoDocumento::where('id_estado', 1)->get();
        return response()->json($tiposDocumento);
    }
}
