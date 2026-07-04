import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Order, PaginatedOrders } from '@/types';

type Props = {
    orders: PaginatedOrders;
};

const STATUS_LABELS: Record<string, string> = {
    pending: '決済待ち',
    confirmed: '注文確定',
    processing: '処理中',
    shipped: '発送済み',
    delivered: '配達完了',
    cancelled: 'キャンセル',
};

const STATUS_COLORS: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-800',
    confirmed:  'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped:    'bg-[#EBDACA] text-[#431608]',
    delivered:  'bg-green-100 text-green-800',
    cancelled:  'bg-gray-100 text-gray-800',
};

export default function OrdersIndex({ orders }: Props) {
    return (
        <MainLayout>
            <Head title="注文履歴" />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">注文履歴</h1>

                {orders.data.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p className="mb-4">注文履歴がありません。</p>
                        <Link href={route('books.index')} className="text-[#B27E6E] hover:underline">
                            本を探す
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {orders.data.map((order: Order) => (
                                <Link
                                    key={order.id}
                                    href={route('orders.show', order.id)}
                                    className="block bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">注文番号 #{order.id}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString('ja-JP')}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                                            {STATUS_LABELS[order.status] ?? order.status}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex justify-between items-end">
                                        <p className="text-sm text-gray-600">
                                            {order.items.length}点
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            ¥{order.total_amount.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {orders.last_page > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {orders.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`px-3 py-1.5 rounded text-sm border ${
                                            link.active
                                                ? 'bg-[#431608] text-white border-[#431608]'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
}
