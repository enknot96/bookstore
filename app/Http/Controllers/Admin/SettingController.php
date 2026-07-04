<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Settings/Edit', [
            'adminNotificationEmail' => Setting::get('admin_notification_email', ''),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'admin_notification_email' => ['nullable', 'email', 'max:255'],
        ]);

        Setting::set('admin_notification_email', $request->admin_notification_email);

        return back()->with('success', '設定を保存しました。');
    }
}
