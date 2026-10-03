import { Link, router, usePage } from '@inertiajs/react';
import { Transition, TransitionChild } from '@headlessui/react';
import { Menu, Pencil, ShoppingCart, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import logo from '@/assets/logo/logo.jpeg';

export default function MainLayout({ children }: { children: ReactNode }) {
    // エラーページなど、共有 props が付かない場合でも動くよう既定値を持たせる
    const props = usePage<{
        auth?: { user: { name: string } | null };
        cartCount?: number;
        flash?: { success?: string; error?: string };
    }>().props;
    const auth = props.auth ?? { user: null };
    const cartCount = props.cartCount ?? 0;
    const flash = props.flash ?? {};

    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col">
            <header className="bg-white border-b border-brand/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link href={route('home')} className="flex items-center gap-2 text-xl font-bold text-brand">
                        <img src={logo} alt="" className="h-10 w-10 object-contain" />
                        こもれび書房
                    </Link>

                    {/* デスクトップ用ナビ */}
                    <nav className="hidden sm:flex items-center gap-4 text-sm">
                        <Link href={route('books.index')} className="font-medium text-brand/90 hover:text-brand-accent transition-colors">
                            本を探す
                        </Link>
                        {auth.user ? (
                            <>
                                <Link href={route('cart.index')} className="relative font-medium text-brand/90 hover:text-brand-accent transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-brand text-brand-cream text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <Link href={route('orders.index')} className="font-medium text-brand/90 hover:text-brand-accent transition-colors">
                                    注文履歴
                                </Link>
                                <span className="text-brand/30">|</span>
                                <Link href={route('profile.edit')} className="flex items-center gap-1 text-brand/70 hover:text-brand-accent transition-colors">
                                    {auth.user.name}
                                    <Pencil className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                    onClick={() => router.post(route('logout'))}
                                    className="font-medium text-brand/80 hover:text-brand-accent transition-colors"
                                >
                                    ログアウト
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-medium text-brand/90 hover:text-brand-accent transition-colors">
                                    ログイン
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-brand-sun text-brand px-3 py-1.5 rounded-full font-medium hover:bg-brand-sun-hover transition-colors"
                                >
                                    新規登録
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* モバイル用: カート常時表示 + ハンバーガー */}
                    <div className="flex items-center gap-3 sm:hidden">
                        {auth.user && (
                            <Link href={route('cart.index')} className="relative text-brand/90">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-brand text-brand-cream text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="メニューを開く"
                            className="text-brand"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* モバイル用メニューパネル */}
                <Transition show={menuOpen}>
                    <TransitionChild
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 -translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-2"
                    >
                        <nav className="sm:hidden border-t border-brand/10 px-4 py-3 flex flex-col text-sm">
                            <Link href={route('books.index')} onClick={closeMenu} className="block py-4 text-center font-medium text-brand/90">
                                本を探す
                            </Link>
                            {auth.user ? (
                                <>
                                    <Link href={route('orders.index')} onClick={closeMenu} className="block py-4 text-center font-medium text-brand/90">
                                        注文履歴
                                    </Link>
                                    <Link href={route('profile.edit')} onClick={closeMenu} className="flex items-center justify-center gap-1 py-4 text-brand/70">
                                        {auth.user.name}
                                        <Pencil className="w-3.5 h-3.5" />
                                    </Link>
                                    <button
                                        onClick={() => {
                                            closeMenu();
                                            router.post(route('logout'));
                                        }}
                                        className="block w-full py-4 text-center font-medium text-brand/80"
                                    >
                                        ログアウト
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} onClick={closeMenu} className="block py-4 text-center font-medium text-brand/90">
                                        ログイン
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        onClick={closeMenu}
                                        className="block py-4 text-center bg-brand-sun text-brand rounded-full font-medium"
                                    >
                                        新規登録
                                    </Link>
                                </>
                            )}
                        </nav>
                    </TransitionChild>
                </Transition>
            </header>

            <Toaster position="top-right" richColors />
            <main className="flex-1">{children}</main>

            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} こもれび書房. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
