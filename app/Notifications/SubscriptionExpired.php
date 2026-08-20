<?php

namespace App\Notifications;

use App\Models\Workspace;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SubscriptionExpired extends Notification
{
    use Queueable;

    public function __construct(public Workspace $workspace) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'subscription_expired',
            'workspace_id' => $this->workspace->id,
            'message' => 'আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়ে গেছে। বিদ্যমান তথ্য দেখতে পাবেন, তবে নতুন কিছু যোগ করতে সাবস্ক্রাইব করুন।',
        ];
    }
}
