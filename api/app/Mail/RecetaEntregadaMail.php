<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo: receta entregada.
 * Confirma que la formula fue dispensada al paciente.
 */
class RecetaEntregadaMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $paciente;
    public $receta;
    public $medicamentoDespachado;
    public $cantidad;
    public $farmacia;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($paciente, $receta, $medicamentoDespachado, $cantidad, $farmacia)
    {
        $this->paciente = $paciente;
        $this->receta = $receta;
        $this->medicamentoDespachado = $medicamentoDespachado;
        $this->cantidad = $cantidad;
        $this->farmacia = $farmacia;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Medicamentos Despachados - Receta #' . $this->receta->id_receta,
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'emails.receta_entregada',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
