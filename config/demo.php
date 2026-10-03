<?php

return [
    /*
     * ポートフォリオ公開用のデモアカウント。
     * これらのメールアドレスのユーザーは、プロフィール編集・パスワード変更・退会ができない。
     */
    // ログイン画面の「デモでログイン」ボタンを有効にするか（本番・ローカルとも環境変数で切り替え）
    'login_enabled' => env('DEMO_LOGIN_ENABLED', false),

    // デモ管理者に許可しない操作（ルート名）。取り返しのつかない削除・管理者/設定の変更を防ぐ
    'blocked_admin_routes' => [
        'admin.books.destroy',
        'admin.books.bulk-destroy',
        'admin.books.force-delete',
        'admin.books.bulk-force-delete',
        'admin.books.trash.empty',
        'admin.admins.store',
        'admin.admins.destroy',
        'admin.settings.update',
        'admin.customers.destroy',
    ],

    'protected_emails' => [
        'admin@example.com',
        'customer@example.com',
    ],
];
