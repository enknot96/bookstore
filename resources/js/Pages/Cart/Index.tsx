import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CartItem, CartItemIssue } from '@/types';
import { toast } from 'sonner';

type Props = {
    cartItems: CartItem[];
    total: number;
};

const ISSUE_MESSAGES: Record<CartItemIssue, string> = {
    unpublished: '現在ご購入いただけません',
    out_of_stock: '在庫切れです',
    insufficient: '在庫が不足しています',
};

export default function CartIndex({ cartItems, total }: Props) {
    const updateQuantity = (id: number, quantity: number) => {
        router.patch(route('cart.update', id), { quantity }, { preserveScroll: true });
    };

    const removeItem = (item: CartItem) => {
        router.delete(route('cart.destroy', item.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`「${item.book.title}」をカートから削除しました`, {
                    duration: 6000,
                    action: {
                        label: '元に戻す',
                        onClick: () =>
                            router.post(
                                route('cart.store'),
                                { book_id: item.book.id, quantity: item.quantity },
                                { preserveScroll: true },
                            ),
                    },
                });
            },
        });
    };

    const hasIssue = cartItems.some((item) => item.issue);

    return (
        <MainLayout>
            <Head title="カート" />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">ショッピングカート</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p className="mb-4">カートに商品がありません。</p>
                        <Link href={route('books.index')} className="text-brand-accent hover:underline">
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
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📚</div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={route('books.show', item.book.id)}
                                            className="font-medium text-gray-900 hover:text-brand-accent line-clamp-2"
                                        >
                                            {item.book.title}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-0.5">{item.book.author}</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            ¥{item.book.price.toLocaleString()}
                                        </p>
                                        {item.issue && (
                                            <p
                                                role="alert"
                                                className="mt-1 inline-block text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded px-2 py-0.5"
                                            >
                                                {ISSUE_MESSAGES[item.issue]}
                                                {item.issue === 'insufficient' &&
                                                    `（在庫${item.book.stock}冊）`}
                                            </p>
                                        )}
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
                                            disabled={item.quantity >= Math.min(99, item.book.stock)}
                                            className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                                        >
                                            ＋
                                        </button>
                                    </div>

                                    <p className="w-24 text-right font-medium text-gray-900">
                                        ¥{item.subtotal.toLocaleString()}
                                    </p>

                                    <button
                                        onClick={() => removeItem(item)}
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
                                <span className="text-2xl font-bold text-brand">
                                    ¥{total.toLocaleString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 text-right -mt-4 mb-6">
                                税込・送料無料
                            </p>
                            {hasIssue ? (
                                <>
                                    <p className="text-sm text-red-700 mb-3">
                                        購入できない商品があります。削除するか数量を調整してください。
                                    </p>
                                    <button
                                        disabled
                                        className="block w-full text-center bg-gray-300 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed"
                                    >
                                        レジへ進む
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href={route('checkout.index')}
                                    className="block w-full text-center bg-brand text-brand-cream py-3 rounded-lg font-medium hover:bg-brand-accent transition-colors"
                                >
                                    レジへ進む
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
