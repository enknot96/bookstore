import { Head, Link } from '@inertiajs/react';
import { orderStatusColor, orderStatusLabel } from '@/lib/orderStatus';
import MainLayout from '@/Layouts/MainLayout';
import { Order } from '@/types';

type Props = {
    order: Order;
};

export default function OrderShow({ order }: Props) {
    return (
        <MainLayout>
            <Head title={`注文 #${order.id}`} />
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Link href={route('orders.index')} className="text-sm text-gray-500 hover:text-brand-link">
                        ← 注文履歴
                    </Link>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">注文 #{order.id}</h1>

                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* ステータス */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">ステータス</span>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${orderStatusColor(order.status)}`}>
                            {orderStatusLabel(order.status)}
                        </span>
                    </div>

                    {/* 注文日 */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">注文日</span>
                        <span className="text-sm text-gray-900">
                            {new Date(order.created_at).toLocaleDateString('ja-JP', {
                                year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </span>
                    </div>

                    {/* 配送先 */}
                    <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">配送先</p>
                        <p className="text-sm text-gray-900">{order.shipping_name}</p>
                        <p className="text-sm text-gray-600">〒{order.shipping_zip}</p>
                        <p className="text-sm text-gray-600">{order.shipping_address}</p>
                    </div>

                    {/* 注文商品 */}
                    <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">注文商品</p>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="w-12 h-14 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                        {item.book.cover_image_path ? (
                                            <img
                                                src={item.book.cover_image_path}
                                                alt={item.book.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">📚</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.book.title}</p>
                                        <p className="text-xs text-gray-500">
                                            ¥{item.unit_price.toLocaleString()} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        ¥{(item.unit_price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 合計 */}
                    <div className="border-t pt-4 flex justify-between items-center">
                        <span className="font-semibold text-gray-900">合計</span>
                        <span className="text-xl font-bold text-brand">
                            ¥{order.total_amount.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
