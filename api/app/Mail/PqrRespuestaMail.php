<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Pqr;

class PqrRespuestaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pqr;

    /**
     * Create a new message instance.
     */
    public function __construct(Pqr $pqr)
    {
        $this->pqr = $pqr;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Respuesta a su PQRS - Saluvanta EPS')
                    ->view('emails.pqr_respuesta');
    }
}
