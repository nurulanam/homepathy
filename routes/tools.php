<?php

use Illuminate\Support\Facades\Route;

$tools = [
    'repertory' => ['title' => 'রিপার্টরি', 'description' => 'রুব্রিক ভিত্তিক রেমেডি অনুসন্ধান।'],
    'materia-medica' => ['title' => 'মেটেরিয়া মেডিকা', 'description' => 'রেমেডি রেফারেন্স লাইব্রেরি।'],
    'miasm' => ['title' => 'মায়াজম বিশ্লেষণ', 'description' => 'সোরা, সাইকোসিস এবং সিফিলিস বিশ্লেষণ।'],
    'temperament' => ['title' => 'টেম্পারামেন্ট', 'description' => 'সাংবিধানিক ধরণ নির্ণয়।'],
    'acute-cases' => ['title' => 'একিউট কেস', 'description' => 'আকস্মিক রোগের চিকিৎসা।'],
    'organon' => ['title' => 'অর্গানন', 'description' => 'অ্যাফোরিজম রেফারেন্স।'],
    'anatomy' => ['title' => 'অ্যানাটমি', 'description' => 'রুব্রিক সংযুক্ত অ্যানাটমি রেফারেন্স।'],
];

Route::middleware(['auth'])->group(function () use ($tools) {
    foreach ($tools as $slug => $meta) {
        Route::inertia("tools/{$slug}", 'tools/coming-soon', $meta)->name("tools.{$slug}");
    }
});
