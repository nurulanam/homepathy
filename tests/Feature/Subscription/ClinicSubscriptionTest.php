<?php

use App\Enums\SubscriptionPlan;
use App\Enums\WorkspaceRole;
use App\Models\Patient;
use App\Models\User;
use App\Services\Workspace\WorkspaceService;

test('a clinic includes 3 seats with no extra cost for the owner alone', function () {
    $owner = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createClinicWorkspace($owner, 'Shanti Homeo Clinic');
    $workspace->subscription()->create([
        'plan' => SubscriptionPlan::Clinic,
        'status' => 'active',
        'starts_at' => now(),
        'ends_at' => now()->addDays(30),
    ]);

    expect(app(WorkspaceService::class)->additionalSeatCount($workspace))->toBe(0);
    expect(app(WorkspaceService::class)->monthlyPriceFor($workspace, SubscriptionPlan::Clinic))->toBe(699);
});

test('inviting beyond 3 seats adds 150 per additional seat', function () {
    $owner = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createClinicWorkspace($owner, 'Shanti Homeo Clinic');
    $workspace->subscription()->create([
        'plan' => SubscriptionPlan::Clinic,
        'status' => 'active',
        'starts_at' => now(),
        'ends_at' => now()->addDays(30),
    ]);

    $service = app(WorkspaceService::class);

    // Owner + 2 staff = 3 seats, still within the included allowance.
    $doctor = User::factory()->create();
    $assistant = User::factory()->create();
    $service->inviteMember($workspace, $doctor->email, WorkspaceRole::Practitioner);
    $service->inviteMember($workspace, $assistant->email, WorkspaceRole::Assistant);

    expect($service->additionalSeatCount($workspace))->toBe(0);

    // A 4th member pushes one seat beyond the included 3.
    $receptionist = User::factory()->create();
    $service->inviteMember($workspace, $receptionist->email, WorkspaceRole::Receptionist);

    expect($service->additionalSeatCount($workspace))->toBe(1);
    expect($service->monthlyPriceFor($workspace, SubscriptionPlan::Clinic))->toBe(699 + 150);
});

test('invited members must accept before being marked joined', function () {
    $owner = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createClinicWorkspace($owner, 'Shanti Homeo Clinic');
    $service = app(WorkspaceService::class);

    $doctor = User::factory()->create();
    $member = $service->inviteMember($workspace, $doctor->email, WorkspaceRole::Practitioner);

    expect($member->joined_at)->toBeNull();

    $service->acceptInvite($member);

    expect($member->fresh()->joined_at)->not->toBeNull();
});

test('an invited user can accept their own invitation via the accept route', function () {
    $owner = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createClinicWorkspace($owner, 'Shanti Homeo Clinic');
    $service = app(WorkspaceService::class);

    $doctor = User::factory()->create();
    $member = $service->inviteMember($workspace, $doctor->email, WorkspaceRole::Practitioner);

    $response = $this
        ->actingAs($doctor)
        ->post(route('clinic.invitations.accept', $member));

    $response->assertSessionHasNoErrors();

    expect($member->fresh()->joined_at)->not->toBeNull();
    expect($doctor->fresh()->current_workspace_id)->toBe($workspace->id);
});

test('a user cannot accept another user\'s invitation', function () {
    $owner = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createClinicWorkspace($owner, 'Shanti Homeo Clinic');
    $service = app(WorkspaceService::class);

    $doctor = User::factory()->create();
    $member = $service->inviteMember($workspace, $doctor->email, WorkspaceRole::Practitioner);

    $intruder = User::factory()->create();

    $this->actingAs($intruder)->post(route('clinic.invitations.accept', $member))->assertForbidden();

    expect($member->fresh()->joined_at)->toBeNull();
});

test('role permission matrix: only owner manages members and billing', function () {
    $owner = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createClinicWorkspace($owner, 'Shanti Homeo Clinic');
    $service = app(WorkspaceService::class);

    $assistant = User::factory()->create();
    $service->inviteMember($workspace, $assistant->email, WorkspaceRole::Assistant);

    $receptionist = User::factory()->create();
    $service->inviteMember($workspace, $receptionist->email, WorkspaceRole::Receptionist);

    expect($owner->can('manage', $workspace))->toBeTrue();
    expect($assistant->can('manage', $workspace))->toBeFalse();
    expect($receptionist->can('manage', $workspace))->toBeFalse();

    expect(WorkspaceRole::Assistant->canManagePatients())->toBeTrue();
    expect(WorkspaceRole::Receptionist->canManageCases())->toBeFalse();
    expect(WorkspaceRole::Receptionist->canAccessClinicalTools())->toBeFalse();
});

test('a personal (practitioner) workspace cannot invite additional members', function () {
    $owner = User::factory()->create();
    $workspace = app(WorkspaceService::class)->createPersonalWorkspace($owner);

    $invitee = User::factory()->create();

    expect(fn () => app(WorkspaceService::class)->inviteMember($workspace, $invitee->email, WorkspaceRole::Practitioner))
        ->toThrow(InvalidArgumentException::class);
});

test('a staff member of one clinic cannot access another clinic patient', function () {
    $ownerA = User::factory()->create();
    $workspaceA = app(WorkspaceService::class)->createClinicWorkspace($ownerA, 'Clinic A');
    $patientA = Patient::factory()->for($workspaceA)->create(['created_by' => $ownerA->id]);

    $ownerB = User::factory()->create();
    app(WorkspaceService::class)->createClinicWorkspace($ownerB, 'Clinic B');

    expect($ownerB->can('view', $patientA))->toBeFalse();
});
