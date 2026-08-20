<?php

namespace App\Notifications;

use App\Models\Workspace;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TrialExpired extends Notification
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
            'type' => 'trial_expired',
            'workspace_id' => $this->workspace->id,
            'message' => 'আপনার ফ্রি ট্রায়াল শেষ হয়ে গেছে। চালিয়ে যেতে সাবস্ক্রাইব করুন।',
        ];
    }
}
