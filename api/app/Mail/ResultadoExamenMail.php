<?php

namespace App\Mail;

use App\Models\Examen;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo: resultado de examen.
 * Notifica disponibilidad de resultado clinico al destinatario.
 */
class ResultadoExamenMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $examen;
    public $pdfPath;

    /**
     * Create a new message instance.
     *
     * @param Examen $examen
     * @param string $pdfPath
     */
    public function __construct(Examen $examen, string $pdfPath)
    {
        $this->examen = $examen;
        $this->pdfPath = $pdfPath;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $nombreExamen = $this->examen->categoriaExamen->categoria ?? 'Examen Clínico';
        return new Envelope(
            subject: "Resultados de tu examen: $nombreExamen - Saluvanta EPS",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.resultado_examen',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromPath($this->pdfPath)
                ->as('Resultados_Examen.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
