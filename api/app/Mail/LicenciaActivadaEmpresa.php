<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LicenciaActivadaEmpresa extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $empresa;
    public $licencia;

    public function __construct($empresa, $licencia)
    {
        $this->empresa = $empresa;
        $this->licencia = $licencia;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Licencia Activada! - Sistema EPS',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.licencia_activada_empresa',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
