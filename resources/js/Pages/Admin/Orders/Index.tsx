import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Order, PaginatedOrders } from '@/types';

type Props = {
    orders: PaginatedOrders & { data: (Order & { user: { name: string; email: string } })[] };
    statuses: Record<string, string>;
    filters: { status?: string };
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

export default function AdminOrdersIndex({ orders, statuses, filters, flash }: Props) {
    const handleStatusFilter = (status: string) => {
        router.get(route('admin.orders.index'), { status: status || undefined }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="注文管理" />
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">注文管理</h1>

                {flash.success && (
                    <p className="mb-4 text-base text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">
                        {flash.success}
                    </p>
                )}

                {/* フィルター */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => handleStatusFilter('')}
                        className={`px-3 py-1.5 rounded-full text-base border transition-colors ${
                            !filters.status ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        すべて
                    </button>
                    {Object.entries(statuses).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => handleStatusFilter(key)}
                            className={`px-3 py-1.5 rounded-full text-base border transition-colors ${
                                filters.status === key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* テーブル */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">注文番号</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">顧客</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">金額</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">ステータス</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">注文日</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-base text-gray-500">
                                        注文がありません
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-base font-medium text-gray-900">#{order.id}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-base text-gray-900">{order.user.name}</p>
                                            <p className="text-sm text-gray-500">{order.user.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-900">
                                            ¥{order.total_amount.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                                                {statuses[order.status] ?? order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('ja-JP')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={route('admin.orders.show', order.id)}
                                                className="text-base text-indigo-600 hover:underline"
                                            >
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ページネーション */}
                {orders.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {orders.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                className={`px-3 py-1.5 rounded text-base border ${
                                    link.active
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
