<?php
namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Usuario;
use App\Http\Controllers\Controller; 
/**
 * Controlador de reportes generales.
 * Centraliza endpoints para consulta y salida de informacion analitica.
 */
class ReporteController extends Controller
{
    public function generarPdf()
    {
        // Limitamos para evitar colapso de memoria al generar PDF
        $users = Usuario::limit(500)->orderBy('documento')->get();
        $data = [
            'titulo' => 'Listado de Usuarios',
            'fecha' => date('d/m/Y'),
            'usuarios' => $users
        ];
        $logoBase64 = '';
        try {
            if (file_exists(public_path('icono.png'))) {
                $logoBase64 = base64_encode(file_get_contents(public_path('icono.png')));
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Error encoding logo for PDF: " . $e->getMessage());
        }

        $data['logoBase64'] = $logoBase64;

        // Cargar la vista con los datos
        $pdf = Pdf::loadView('reporte', $data);

        // Opción A: Descarga directa
        return $pdf->download('lista-usuarios.pdf');

        // Opción B: Abrir en el navegador (stream)
        // return $pdf->stream();
    }
}
