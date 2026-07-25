import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

type Admin = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

type PaginatedAdmins = {
    data: Admin[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    admins: PaginatedAdmins;
    filters: { search?: string };
    flash: { success?: string; error?: string };
    auth: { user: { id: number } };
};

function CreateAdminForm({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.admins.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">新規管理者を追加</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="山田 太郎"
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="admin@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="8文字以上"
                    />
                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（確認）</label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="もう一度入力"
                    />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-base text-gray-600 hover:text-gray-800 px-3 py-1.5"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 text-white text-base px-4 py-1.5 rounded-md hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {processing ? '作成中...' : '管理者を追加'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function AdminsIndex({ admins, filters, flash, auth }: Props) {
    const [showForm, setShowForm] = useState(false);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const search = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
        router.get(route('admin.admins.index'), { search: search || undefined }, { preserveState: true });
    };

    const handleDelete = (admin: Admin) => {
        if (!confirm(`「${admin.name}」のアカウントを削除しますか？`)) return;
        router.delete(route('admin.admins.destroy', admin.id), { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="管理者管理" />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">管理者管理</h1>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white text-base px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            <Plus size={16} />
                            管理者を追加
                        </button>
                    )}
                </div>

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

                {showForm && <CreateAdminForm onClose={() => setShowForm(false)} />}

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
                    </form>
                    <span className="text-base text-gray-500 self-center">全 {admins.total} 名</span>
                </div>

                {/* テーブル */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">管理者</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">登録日</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {admins.data.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-base text-gray-500">
                                        管理者が見つかりません
                                    </td>
                                </tr>
                            ) : (
                                admins.data.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="text-base font-medium text-gray-900">
                                                {admin.name}
                                                {admin.id === auth.user.id && (
                                                    <span className="ml-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5">
                                                        あなた
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500">{admin.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-500">
                                            {new Date(admin.created_at).toLocaleDateString('ja-JP')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {admin.id !== auth.user.id && (
                                                <button
                                                    onClick={() => handleDelete(admin)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded"
                                                    title="削除"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ページネーション */}
                {admins.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {admins.links.map((link, i) => (
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
