<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LicenciaActivadaAdmin extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $empresa;
    public $user;

    public function __construct($empresa, $user)
    {
        $this->empresa = $empresa;
        $this->user = $user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu cuenta de Administrador ha sido activada - Sistema EPS',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.licencia_activada_admin',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
