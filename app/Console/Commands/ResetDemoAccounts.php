<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

#[Signature('demo:reset')]
#[Description('デモ用アカウント（管理者・一般ユーザー）を初期状態に復元する')]
class ResetDemoAccounts extends Command
{
    private const ACCOUNTS = [
        ['email' => 'admin@example.com', 'name' => '管理者', 'role' => 'admin'],
        ['email' => 'customer@example.com', 'name' => 'テストユーザー', 'role' => 'customer'],
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        foreach (self::ACCOUNTS as $account) {
            $user = User::withTrashed()->where('email', $account['email'])->first();

            if ($user) {
                $user->restore();
                $user->update([
                    'name'     => $account['name'],
                    'role'     => $account['role'],
                    'password' => Hash::make('password'),
                ]);
                $this->info("復元しました: {$account['email']}");
                continue;
            }

            User::create([
                'name'     => $account['name'],
                'email'    => $account['email'],
                'password' => Hash::make('password'),
                'role'     => $account['role'],
            ]);
            $this->info("作成しました: {$account['email']}");
        }

        return self::SUCCESS;
    }
}
