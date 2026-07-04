<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewOrderAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public \App\Models\Order $order)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '【BookStore管理】新規注文が入りました（注文番号 #' . $this->order->id . '）',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.new-order-alert',
            with: ['order' => $this->order],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
