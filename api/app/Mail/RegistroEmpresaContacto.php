<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo: registro de empresa para contacto.
 * Notificacion inicial de onboarding para el contacto principal.
 */
class RegistroEmpresaContacto extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $empresa;

    public function __construct($empresa)
    {
        $this->empresa = $empresa;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Registro de Empresa Exitoso - Sistema EPS',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.registro_empresa_contacto',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
