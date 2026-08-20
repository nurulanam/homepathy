<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('theme')->default('system')->after('current_workspace_id');
            $table->string('accent_color')->default('teal')->after('theme');
            $table->string('font_family')->default('instrument')->after('accent_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['theme', 'accent_color', 'font_family']);
        });
    }
};
