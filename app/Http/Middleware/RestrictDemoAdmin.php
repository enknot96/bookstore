<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** デモ管理者に、取り返しのつかない操作（削除・管理者/設定の変更）をさせない */
class RestrictDemoAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->isDemoAccount() && in_array($request->route()?->getName(), config('demo.blocked_admin_routes'), true)) {
            return back()->with('error', 'デモアカウントのため、この操作はできません。');
        }

        return $next($request);
    }
}
