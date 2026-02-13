<?php
namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Usuario;
use App\Http\Controllers\Controller; 
class ReporteController extends Controller
{
    public function generarPdf()
    {
        $users = Usuario::all();
        $data = [
            'titulo' => 'Listado de Usuarios',
            'fecha' => date('d/m/Y'),
            'usuarios' => $users
        ];

        // Cargar la vista con los datos
        $pdf = Pdf::loadView('reporte', $data);

        // Opción A: Descarga directa
        return $pdf->download('lista-usuarios.pdf');

        // Opción B: Abrir en el navegador (stream)
        // return $pdf->stream();
    }
}