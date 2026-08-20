<?php

namespace App\Http\Controllers;

use App\Enums\WorkspaceRole;
use App\Enums\WorkspaceType;
use App\Http\Requests\Subscription\InviteMemberRequest;
use App\Http\Requests\Subscription\UpdateMemberRoleRequest;
use App\Models\WorkspaceMember;
use App\Services\Workspace\WorkspaceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceMemberController extends Controller
{
    public function __construct(private readonly WorkspaceService $workspaces) {}

    public function index(Request $request): Response
    {
        $workspace = $request->user()->currentWorkspace;

        $members = $workspace->members()
            ->with('user:id,name,email')
            ->get()
            ->map(fn (WorkspaceMember $member) => [
                'id' => $member->id,
                'name' => $member->user->name,
                'email' => $member->user->email,
                'role' => $member->role->value,
                'status' => $member->joined_at ? 'accepted' : 'pending',
                'joined_at' => $member->joined_at?->toIso8601String(),
            ]);

        return Inertia::render('clinic/members', [
            'members' => $members,
            'seats' => [
                'included' => $workspace->subscription->plan->includedSeats(),
                'used' => $workspace->members()->count(),
                'additional' => $this->workspaces->additionalSeatCount($workspace),
                'additional_price' => $workspace->subscription->plan->extraSeatPrice(),
            ],
            'isOwner' => $workspace->owner_id === $request->user()->id,
        ]);
    }

    public function invite(InviteMemberRequest $request): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace;

        abort_unless($workspace->type === WorkspaceType::Clinic, 403);

        $this->workspaces->inviteMember(
            $workspace,
            $request->validated('email'),
            WorkspaceRole::from($request->validated('role')),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('আমন্ত্রণ পাঠানো হয়েছে।')]);

        return back();
    }

    public function destroy(Request $request, WorkspaceMember $member): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace;

        abort_unless($request->user()->can('manage', $workspace), 403);

        $this->workspaces->removeMember($workspace, $member);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('সদস্য অপসারণ করা হয়েছে।')]);

        return back();
    }

    public function updateRole(UpdateMemberRoleRequest $request, WorkspaceMember $member): RedirectResponse
    {
        $workspace = $request->user()->currentWorkspace;

        $this->workspaces->changeRole($workspace, $member, WorkspaceRole::from($request->validated('role')));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('ভূমিকা আপডেট হয়েছে।')]);

        return back();
    }
}
