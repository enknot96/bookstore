import { Head, Link, router } from '@inertiajs/react';
import { orderStatusColor, orderStatusLabel } from '@/lib/orderStatus';
import Pagination from '@/Components/Pagination';
import MainLayout from '@/Layouts/MainLayout';
import { Order, PaginatedOrders } from '@/types';

type Props = {
    orders: PaginatedOrders;
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
                        <Link href={route('books.index')} className="text-brand-link hover:underline">
                            本を探す
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {orders.data.map((order: Order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <Link href={route('orders.show', order.id)} className="block p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">注文番号 #{order.id}</p>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {new Date(order.created_at).toLocaleDateString('ja-JP')}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${orderStatusColor(order.status)}`}>
                                                {orderStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex -space-x-2 shrink-0">
                                                {order.items.slice(0, 3).map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="w-10 h-14 rounded border border-white bg-brand-sand overflow-hidden"
                                                    >
                                                        {item.book.cover_image_path && (
                                                            <img
                                                                src={item.book.cover_image_path}
                                                                alt=""
                                                                loading="lazy"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-700 min-w-0 flex-1 line-clamp-2">
                                                {order.items[0]?.book.title}
                                                {order.items.length > 1 && ` ほか${order.items.length - 1}点`}
                                            </p>
                                            <p className="font-bold text-gray-900 shrink-0">
                                                ¥{order.total_amount.toLocaleString()}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="border-t px-5 py-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => router.post(route('orders.reorder', order.id))}
                                            className="text-sm font-medium text-brand-link hover:underline"
                                        >
                                            もう一度買う
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination links={orders.links} className="mt-8" />
                    </>
                )}
            </div>
        </MainLayout>
    );
}
