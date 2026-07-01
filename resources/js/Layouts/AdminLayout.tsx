import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/admin', label: 'ダッシュボード', icon: LayoutDashboard },
    { href: '/admin/books', label: '書籍管理', icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* モバイル用オーバーレイ */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* サイドバー */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-30 w-56 bg-white border-r flex flex-col transition-transform duration-200',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    'lg:static lg:translate-x-0',
                )}
            >
                <div className="flex items-center gap-2 px-4 h-14 border-b font-semibold text-gray-800">
                    <BookOpen size={18} />
                    <span>管理画面</span>
                </div>
                <nav className="flex-1 py-4 space-y-1 px-2">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                url.startsWith(href) && href !== '/admin'
                                    ? 'bg-primary text-primary-foreground'
                                    : url === href
                                      ? 'bg-primary text-primary-foreground'
                                      : 'text-gray-600 hover:bg-gray-100',
                            )}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Link
                        href="/"
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ← 公開サイトへ
                    </Link>
                </div>
            </aside>

            {/* メインコンテンツ */}
            <div className="flex-1 flex flex-col min-w-0 overflow-auto">
                <header className="h-14 bg-white border-b flex items-center gap-3 px-4 sticky top-0 z-10">
                    <button
                        className="lg:hidden p-1 rounded hover:bg-gray-100"
                        onClick={() => setSidebarOpen((v) => !v)}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <span className="text-sm text-gray-500">児童書EC 管理</span>
                </header>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
