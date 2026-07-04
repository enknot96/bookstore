import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

export default function MainLayout({ children }: { children: ReactNode }) {
    const { auth, cartCount, flash } = usePage<{
        auth: { user: { name: string } | null };
        cartCount: number;
        flash: { success?: string; error?: string };
    }>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-[#FDFAEB] flex flex-col">
            <header className="bg-white border-b border-[#431608]/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link href={route('home')} className="text-xl font-bold text-[#431608]">
                        📚 BookStore
                    </Link>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href={route('books.index')} className="text-[#431608]/70 hover:text-[#B27E6E] transition-colors">
                            本を探す
                        </Link>
                        {auth.user ? (
                            <>
                                <Link href={route('cart.index')} className="relative text-[#431608]/70 hover:text-[#B27E6E] transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-[#431608] text-[#FDFAEB] text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <Link href={route('orders.index')} className="text-[#431608]/70 hover:text-[#B27E6E] transition-colors">
                                    注文履歴
                                </Link>
                                <span className="text-[#431608]/30">|</span>
                                <span className="text-[#431608]/70">{auth.user.name}</span>
                                <button
                                    onClick={() => router.post(route('logout'))}
                                    className="text-[#431608]/60 hover:text-[#B27E6E] transition-colors"
                                >
                                    ログアウト
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-[#431608]/70 hover:text-[#B27E6E] transition-colors">
                                    ログイン
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-[#FFF17C] text-[#431608] px-3 py-1.5 rounded-full font-medium hover:bg-[#ED946D] transition-colors"
                                >
                                    新規登録
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <Toaster position="top-right" richColors />
            <main className="flex-1">{children}</main>

            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
                    &copy; 2025 BookStore. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
