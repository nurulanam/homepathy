<?php

namespace App\Notifications;

use App\Models\Workspace;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TrialEndingSoon extends Notification
{
    use Queueable;

    public function __construct(public Workspace $workspace, public int $daysRemaining) {}

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
            'type' => 'trial_ending_soon',
            'workspace_id' => $this->workspace->id,
            'days_remaining' => $this->daysRemaining,
            'message' => "আপনার ফ্রি ট্রায়াল আর {$this->daysRemaining} দিনে শেষ হবে। সাবস্ক্রিপশন নবায়ন করুন।",
        ];
    }
}
