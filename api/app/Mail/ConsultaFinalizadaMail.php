<?php

namespace App\Mail;

use App\Models\Cita;
use App\Models\HistorialDetalle;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Correo: consulta finalizada.
 * Informa que una atencion medica ha sido cerrada.
 */
class ConsultaFinalizadaMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Cita $cita;
    public HistorialDetalle $detalle;
    public $remisiones;
    public $receta;

    /**
     * Create a new message instance.
     */
    public function __construct(Cita $cita, HistorialDetalle $detalle, $remisiones, $receta)
    {
        $this->cita = $cita;
        $this->detalle = $detalle;
        $this->remisiones = $remisiones;
        $this->receta = $receta;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Resultado de Consulta Médica #' . $this->cita->id_cita . ' - Saluvanta EPS',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.consulta_finalizada',
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
