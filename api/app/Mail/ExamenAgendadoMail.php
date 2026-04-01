<?php

namespace App\Mail;

use App\Models\Examen;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo: examen agendado.
 * Envia confirmacion de fecha y datos de examen clinico.
 */
class ExamenAgendadoMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Examen $examen;

    /**
     * Create a new message instance.
     */
    public function __construct(Examen $examen)
    {
        $this->examen = $examen;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Notificación: Examen de Laboratorio Asignado - Saluvanta EPS',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.examen_agendado',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
