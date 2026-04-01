<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo: recordatorio de cita.
 * Envio programado previo a la fecha/hora de atencion.
 */
class RecordatorioCitaMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $registro;
    public string $tipoEvento;

    /**
     * Create a new message instance.
     */
    public function __construct($registro, string $tipoEvento)
    {
        // Puede recibir una instancia de Cita o Examen
        $this->registro = $registro;
        $this->tipoEvento = $tipoEvento;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recordatorio Mañana: ' . ucfirst($this->tipoEvento) . ' Médica - Saluvanta EPS',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.recordatorio_cita',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
