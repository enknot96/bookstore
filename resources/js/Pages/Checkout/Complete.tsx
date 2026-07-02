import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Order } from '@/types';

type Props = {
    order: Order;
};

const STATUS_LABELS: Record<string, string> = {
    pending: '決済待ち',
    confirmed: '注文確定',
    processing: '処理中',
    shipped: '発送済み',
    delivered: '配達完了',
    cancelled: 'キャンセル',
};

export default function CheckoutComplete({ order }: Props) {
    return (
        <MainLayout>
            <Head title="注文完了" />
            <div className="max-w-xl mx-auto px-4 py-16 text-center">
                <div className="text-5xl mb-6">🎉</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">ご注文ありがとうございます！</h1>
                <p className="text-gray-500 mb-8">注文番号: #{order.id}</p>

                <div className="bg-white rounded-lg shadow-sm p-6 text-left mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">ステータス</span>
                        <span className="text-sm font-medium text-indigo-600">
                            {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">お届け先</span>
                        <span className="text-sm text-gray-900">{order.shipping_name}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm text-gray-500">合計金額</span>
                        <span className="text-lg font-bold text-indigo-600">
                            ¥{order.total_amount.toLocaleString()}
                        </span>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                    {item.book.title} × {item.quantity}
                                </span>
                                <span className="text-gray-900">
                                    ¥{(item.unit_price * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={route('orders.show', order.id)}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        注文詳細を見る
                    </Link>
                    <Link
                        href={route('books.index')}
                        className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        買い物を続ける
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
