import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { orderStatusColor } from '@/lib/orderStatus';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Order, PaginatedOrders } from '@/types';

type Props = {
    orders: PaginatedOrders & { data: (Order & { user: { name: string; email: string } })[] };
    statuses: Record<string, string>;
    filters: { status?: string; q?: string };
};

export default function AdminOrdersIndex({ orders, statuses, filters }: Props) {
    const [query, setQuery] = useState(filters.q ?? '');

    const applyFilter = (overrides: { status?: string; q?: string }) => {
        router.get(
            route('admin.orders.index'),
            { status: filters.status || undefined, q: query.trim() || undefined, ...overrides },
            { preserveState: true },
        );
    };

    const handleStatusFilter = (status: string) => applyFilter({ status: status || undefined });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        applyFilter({ q: query.trim() || undefined });
    };

    return (
        <AdminLayout>
            <Head title="注文管理" />
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">注文管理</h1>

                {/* 検索 */}
                <form onSubmit={handleSearch} role="search" className="flex gap-2 mb-4">
                    <label htmlFor="order-search" className="sr-only">
                        注文を検索
                    </label>
                    <input
                        id="order-search"
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="注文番号・顧客名・メールで検索"
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-ring w-72 max-w-full"
                    />
                    <button
                        type="submit"
                        className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-base hover:bg-primary/90"
                    >
                        検索
                    </button>
                </form>

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
                                            <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${orderStatusColor(order.status)}`}>
                                                {statuses[order.status] ?? order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('ja-JP')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={route('admin.orders.show', order.id)}
                                                className="text-base text-primary hover:underline"
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
                <Pagination links={orders.links} className="mt-6" />
            </div>
        </AdminLayout>
    );
}
