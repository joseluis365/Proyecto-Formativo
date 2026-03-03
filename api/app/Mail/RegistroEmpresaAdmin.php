<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RegistroEmpresaAdmin extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $empresa;
    public $user;
    public $password;

    public function __construct($empresa, $user, $password)
    {
        $this->empresa = $empresa;
        $this->user = $user;
        $this->password = $password;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Credenciales de Acceso Administrador - Sistema EPS',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.registro_empresa_admin',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
