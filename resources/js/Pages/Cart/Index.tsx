import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CartItem } from '@/types';

type Props = {
    cartItems: CartItem[];
    total: number;
    flash: { success?: string; error?: string };
};

export default function CartIndex({ cartItems, total, flash }: Props) {
    const updateQuantity = (id: number, quantity: number) => {
        router.patch(route('cart.update', id), { quantity }, { preserveScroll: true });
    };

    const removeItem = (id: number) => {
        router.delete(route('cart.destroy', id), { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="カート" />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">ショッピングカート</h1>

                {flash.success && (
                    <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">
                        {flash.success}
                    </p>
                )}

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p className="mb-4">カートに商品がありません。</p>
                        <Link href={route('books.index')} className="text-indigo-600 hover:underline">
                            本を探す
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4">
                                    <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                        {item.book.cover_image_path ? (
                                            <img
                                                src={item.book.cover_image_path}
                                                alt={item.book.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📚</div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={route('books.show', item.book.id)}
                                            className="font-medium text-gray-900 hover:text-indigo-600 line-clamp-2"
                                        >
                                            {item.book.title}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-0.5">{item.book.author}</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            ¥{item.book.price.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= 99}
                                            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                        >
                                            ＋
                                        </button>
                                    </div>

                                    <p className="w-24 text-right font-medium text-gray-900">
                                        ¥{item.subtotal.toLocaleString()}
                                    </p>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 ml-2"
                                        aria-label="削除"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-medium text-gray-900">合計</span>
                                <span className="text-2xl font-bold text-indigo-600">
                                    ¥{total.toLocaleString()}
                                </span>
                            </div>
                            <Link
                                href={route('checkout.index')}
                                className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                            >
                                レジへ進む
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
