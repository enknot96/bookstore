import { Link, router, usePage } from '@inertiajs/react';
import { Transition, TransitionChild } from '@headlessui/react';
import { Menu, Pencil, Search, ShoppingCart, X } from 'lucide-react';
import { FormEvent, ReactNode, useState } from 'react';
import FlashToaster from '@/Components/FlashToaster';
import logo from '@/assets/logo/logo.jpeg';

function HeaderSearch({ className, onSearch }: { className?: string; onSearch?: () => void }) {
    const [keyword, setKeyword] = useState('');

    const submit = (e: FormEvent) => {
        e.preventDefault();
        onSearch?.();
        router.get(route('books.index'), keyword.trim() ? { keyword: keyword.trim() } : {});
    };

    return (
        <form onSubmit={submit} role="search" className={className}>
            <label htmlFor="header-search" className="sr-only">
                キーワード検索
            </label>
            <div className="relative">
                <input
                    id="header-search"
                    type="search"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="タイトル・著者で検索"
                    className="w-full rounded-full border border-brand/20 bg-brand-cream/60 pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
                <button
                    type="submit"
                    aria-label="検索"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-brand/70 hover:text-brand-accent"
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
}

const navLinkClass = (active: boolean) =>
    `font-medium transition-colors hover:text-brand-accent ${
        active ? 'text-brand-accent underline underline-offset-8 decoration-2' : 'text-brand/90'
    }`;

export default function MainLayout({ children }: { children: ReactNode }) {
    // エラーページなど、共有 props が付かない場合でも動くよう既定値を持たせる
    const props = usePage<{
        auth?: { user: { name: string } | null };
        cartCount?: number;
    }>().props;
    const auth = props.auth ?? { user: null };
    const cartCount = props.cartCount ?? 0;
    const { url } = usePage();
    const path = url.split('?')[0];
    const isActive = (href: string) => path === href || path.startsWith(`${href}/`);

    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

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
                        <HeaderSearch className="hidden lg:block w-56" />
                        <Link
                            href={route('books.index')}
                            aria-current={isActive('/books') ? 'page' : undefined}
                            className={navLinkClass(isActive('/books'))}
                        >
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
                                <Link
                                    href={route('orders.index')}
                                    aria-current={isActive('/orders') ? 'page' : undefined}
                                    className={navLinkClass(isActive('/orders'))}
                                >
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
                            <HeaderSearch className="py-3" onSearch={closeMenu} />
                            <Link
                                href={route('books.index')}
                                onClick={closeMenu}
                                aria-current={isActive('/books') ? 'page' : undefined}
                                className={`block py-4 text-center ${navLinkClass(isActive('/books'))}`}
                            >
                                本を探す
                            </Link>
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('orders.index')}
                                        onClick={closeMenu}
                                        aria-current={isActive('/orders') ? 'page' : undefined}
                                        className={`block py-4 text-center ${navLinkClass(isActive('/orders'))}`}
                                    >
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

            <FlashToaster />
            <main className="flex-1">{children}</main>

            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-500">
                    <nav
                        aria-label="フッター"
                        className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4"
                    >
                        <Link href={route('books.index')} className="hover:text-brand-accent">
                            本を探す
                        </Link>
                        <Link href={route('legal.tokushoho')} className="hover:text-brand-accent">
                            特定商取引法に基づく表記
                        </Link>
                        <Link href={route('legal.privacy')} className="hover:text-brand-accent">
                            プライバシーポリシー
                        </Link>
                        <Link href={route('contact')} className="hover:text-brand-accent">
                            お問い合わせ
                        </Link>
                    </nav>
                    <p className="text-center">
                        &copy; {new Date().getFullYear()} こもれび書房. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
