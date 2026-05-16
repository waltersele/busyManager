<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $alertTitle,
        public string $alertBody,
        public string $severity,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '[BusyManager] '.$this->alertTitle);
    }

    public function content(): Content
    {
        return new Content(
            htmlString: '<h2>'.$this->alertTitle.'</h2><p>'.$this->alertBody.'</p><p><em>Severidad: '.$this->severity.'</em></p>',
        );
    }
}
