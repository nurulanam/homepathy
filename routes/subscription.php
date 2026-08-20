<?php

use App\Http\Controllers\ClinicInvitationController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\Subscription\PaymentController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\WorkspaceMemberController;
use Illuminate\Support\Facades\Route;

Route::get('pricing', PricingController::class)->name('pricing');

Route::middleware(['auth'])->group(function () {
    Route::get('subscription', [SubscriptionController::class, 'show'])->name('subscription.show');

    Route::get('subscription/payment/{plan}', [PaymentController::class, 'create'])->name('subscription.payment.create');
    Route::post('subscription/payment', [PaymentController::class, 'store'])->name('subscription.payment.store');
    Route::get('subscription/payments', [PaymentController::class, 'history'])->name('subscription.payments.history');

    Route::get('clinic/members', [WorkspaceMemberController::class, 'index'])->name('clinic.members.index');
    Route::post('clinic/members/invite', [WorkspaceMemberController::class, 'invite'])->name('clinic.members.invite');
    Route::delete('clinic/members/{member}', [WorkspaceMemberController::class, 'destroy'])->name('clinic.members.destroy');
    Route::post('clinic/members/{member}/role', [WorkspaceMemberController::class, 'updateRole'])->name('clinic.members.updateRole');

    Route::get('clinic/invitations', [ClinicInvitationController::class, 'index'])->name('clinic.invitations.index');
    Route::post('clinic/invitations/{member}/accept', [ClinicInvitationController::class, 'accept'])->name('clinic.invitations.accept');
});
