import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    orders_count: number;
    created_at: string;
};

type PaginatedUsers = {
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    users: PaginatedUsers;
    filters: { search?: string; role?: string };
    flash: { success?: string; error?: string };
};

function RoleSelect({ user }: { user: User }) {
    const { patch, processing } = useForm({ role: user.role });
    const [role, setRole] = useState(user.role);

    const handleChange = (newRole: 'admin' | 'customer') => {
        setRole(newRole);
        router.patch(route('admin.users.update', user.id), { role: newRole }, {
            preserveScroll: true,
        });
    };

    return (
        <select
            value={role}
            onChange={(e) => handleChange(e.target.value as 'admin' | 'customer')}
            disabled={processing}
            className={`text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                role === 'admin'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
            }`}
        >
            <option value="customer">一般ユーザー</option>
            <option value="admin">管理者</option>
        </select>
    );
}

export default function AdminUsersIndex({ users, filters, flash }: Props) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const search = (form.elements.namedItem('search') as HTMLInputElement).value;
        router.get(route('admin.users.index'), { search, role: filters.role }, { preserveState: true });
    };

    const handleRoleFilter = (role: string) => {
        router.get(route('admin.users.index'), { role: role || undefined, search: filters.search }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="ユーザー管理" />
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">ユーザー管理</h1>

                {flash.success && (
                    <p className="mb-4 text-base text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">
                        {flash.success}
                    </p>
                )}
                {flash.error && (
                    <p className="mb-4 text-base text-red-700 bg-red-50 border border-red-200 rounded px-4 py-2">
                        {flash.error}
                    </p>
                )}

                {/* 検索・フィルター */}
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
                    </form>

                    <div className="flex gap-2">
                        {[
                            { value: '', label: 'すべて' },
                            { value: 'admin', label: '管理者' },
                            { value: 'customer', label: '一般ユーザー' },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => handleRoleFilter(value)}
                                className={`px-3 py-1.5 rounded-full text-base border transition-colors ${
                                    (filters.role ?? '') === value
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <span className="text-base text-gray-500 self-center">全 {users.total} 名</span>
                </div>

                {/* テーブル */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">ユーザー</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">注文数</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">登録日</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">ロール</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-base text-gray-500">
                                        ユーザーが見つかりません
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="text-base font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-600">
                                            {user.orders_count}件
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString('ja-JP')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <RoleSelect user={user} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ページネーション */}
                {users.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {users.links.map((link, i) => (
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
