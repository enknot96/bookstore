import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Order } from '@/types';
import { useState } from 'react';

type User = { name: string; email: string };

type Props = {
    order: Order & { user: User };
    statuses: Record<string, string>;
    flash: { success?: string };
};

const STATUS_COLORS: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-800',
    confirmed:  'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped:    'bg-indigo-100 text-indigo-800',
    delivered:  'bg-green-100 text-green-800',
    cancelled:  'bg-gray-100 text-gray-800',
};

export default function AdminOrderShow({ order, statuses, flash }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(order.status);

    const handleStatusUpdate = () => {
        if (selectedStatus === order.status) return;
        router.patch(route('admin.orders.update', order.id), { status: selectedStatus });
    };

    return (
        <AdminLayout>
            <Head title={`注文 #${order.id}`} />
            <div className="p-6 max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('admin.orders.index')} className="text-base text-gray-500 hover:text-indigo-600">
                        ← 注文一覧
                    </Link>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">注文 #{order.id}</h1>

                {flash.success && (
                    <p className="mb-4 text-base text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">
                        {flash.success}
                    </p>
                )}

                <div className="space-y-6">
                    {/* ステータス変更 */}
                    <div className="bg-white rounded-lg shadow-sm p-5">
                        <h2 className="text-base font-medium text-gray-700 mb-3">ステータス変更</h2>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                                現在: {statuses[order.status] ?? order.status}
                            </span>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {Object.entries(statuses).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={selectedStatus === order.status}
                                className="bg-indigo-600 text-white text-base px-4 py-1.5 rounded-md hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                            >
                                更新
                            </button>
                        </div>
                    </div>

                    {/* 顧客・配送情報 */}
                    <div className="bg-white rounded-lg shadow-sm p-5">
                        <h2 className="text-base font-medium text-gray-700 mb-3">顧客情報</h2>
                        <p className="text-base text-gray-900">{order.user.name}</p>
                        <p className="text-base text-gray-500">{order.user.email}</p>

                        <h2 className="text-base font-medium text-gray-700 mt-4 mb-2">配送先</h2>
                        <p className="text-base text-gray-900">{order.shipping_name}</p>
                        <p className="text-base text-gray-600">〒{order.shipping_zip}</p>
                        <p className="text-base text-gray-600">{order.shipping_address}</p>
                    </div>

                    {/* 注文商品 */}
                    <div className="bg-white rounded-lg shadow-sm p-5">
                        <h2 className="text-base font-medium text-gray-700 mb-3">注文商品</h2>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="w-10 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                        {item.book.cover_image_path ? (
                                            <img src={item.book.cover_image_path} alt={item.book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-base">📚</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-medium text-gray-900 truncate">{item.book.title}</p>
                                        <p className="text-sm text-gray-500">¥{item.unit_price.toLocaleString()} × {item.quantity}</p>
                                    </div>
                                    <p className="text-base font-medium text-gray-900">
                                        ¥{(item.unit_price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t mt-4 pt-4 flex justify-between">
                            <span className="font-semibold text-gray-900">合計</span>
                            <span className="text-lg font-bold text-indigo-600">
                                ¥{order.total_amount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
