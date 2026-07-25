import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

type Customer = {
    id: number;
    name: string;
    email: string;
    orders_count: number;
    orders_sum_total_amount: number | null;
    created_at: string;
};

type PaginatedCustomers = {
    data: Customer[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    customers: PaginatedCustomers;
    filters: { search?: string };
};

export default function CustomersIndex({ customers, filters }: Props) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const search = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
        router.get(route('admin.customers.index'), { search: search || undefined }, { preserveState: true });
    };

    const formatAmount = (amount: number | null) => {
        if (!amount) return '¥0';
        return `¥${amount.toLocaleString('ja-JP')}`;
    };

    return (
        <AdminLayout>
            <Head title="顧客管理" />
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">顧客管理</h1>

                {/* 検索 */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            name="search"
                            defaultValue={filters.search ?? ''}
                            placeholder="名前・メールで検索"
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
                        />
                        <button
                            type="submit"
                            className="bg-gray-800 text-white text-base px-3 py-1.5 rounded-md hover:bg-gray-700"
                        >
                            検索
                        </button>
                        {filters.search && (
                            <button
                                type="button"
                                onClick={() => router.get(route('admin.customers.index'), {}, { preserveState: true })}
                                className="text-base text-gray-500 hover:text-gray-700 px-2"
                            >
                                クリア
                            </button>
                        )}
                    </form>
                    <span className="text-base text-gray-500 self-center">全 {customers.total} 名</span>
                </div>

                {/* テーブル */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">顧客</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">注文数</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">合計購入金額</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">登録日</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {customers.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-base text-gray-500">
                                        顧客が見つかりません
                                    </td>
                                </tr>
                            ) : (
                                customers.data.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="text-base font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-sm text-gray-500">{customer.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-600">
                                            {customer.orders_count}件
                                        </td>
                                        <td className="px-4 py-3 text-base font-medium text-gray-900">
                                            {formatAmount(customer.orders_sum_total_amount)}
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-500">
                                            {new Date(customer.created_at).toLocaleDateString('ja-JP')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ページネーション */}
                {customers.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {customers.links.map((link, i) => (
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
