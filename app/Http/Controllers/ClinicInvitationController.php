<?php

namespace App\Http\Controllers;

use App\Models\WorkspaceMember;
use App\Services\Workspace\WorkspaceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClinicInvitationController extends Controller
{
    public function __construct(private readonly WorkspaceService $workspaces) {}

    /**
     * Pending clinic invitations awaiting this user's response.
     */
    public function index(Request $request): Response
    {
        $invitations = WorkspaceMember::where('user_id', $request->user()->id)
            ->whereNull('joined_at')
            ->with('workspace')
            ->get()
            ->map(fn (WorkspaceMember $member) => [
                'id' => $member->id,
                'workspace_name' => $member->workspace->name,
                'role' => $member->role->value,
            ]);

        return Inertia::render('clinic/invitations', [
            'invitations' => $invitations,
        ]);
    }

    /**
     * Accept a pending invitation and switch into that clinic workspace.
     */
    public function accept(Request $request, WorkspaceMember $member): RedirectResponse
    {
        abort_unless($member->user_id === $request->user()->id, 403);
        abort_if($member->joined_at !== null, 404);

        $this->workspaces->acceptInvite($member);

        $request->user()->forceFill(['current_workspace_id' => $member->workspace_id])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('আপনি ক্লিনিকে যোগ দিয়েছেন।')]);

        return to_route('subscription.show');
    }
}
