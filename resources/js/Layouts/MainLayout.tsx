import { Link, usePage } from '@inertiajs/react';
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link href={route('home')} className="text-xl font-bold text-indigo-600">
                        📚 BookStore
                    </Link>
                    <nav className="flex items-center gap-4 text-sm">
                        <Link href={route('books.index')} className="text-gray-600 hover:text-indigo-600">
                            本を探す
                        </Link>
                        {auth.user ? (
                            <>
                                <Link href={route('cart.index')} className="relative text-gray-600 hover:text-indigo-600">
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <Link href={route('orders.index')} className="text-gray-600 hover:text-indigo-600">
                                    注文履歴
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-gray-600 hover:text-indigo-600">
                                    ログイン
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700"
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
