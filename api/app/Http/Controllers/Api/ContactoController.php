<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactoRequest;
use App\Mail\ContactoMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactoController extends Controller
{
    public function send(StoreContactoRequest $request)
    {
        $contactEmail = env('CONTACT_EMAIL', 'admin@eps.com');

        try {
            Mail::to($contactEmail)->send(new ContactoMail($request->validated()));
            
            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado correctamente.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error enviando correo de contacto: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje. Intente de nuevo más tarde.'
            ], 500);
        }
    }
}
