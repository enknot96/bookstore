import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

type Props = {
    adminNotificationEmail: string;
    flash: { success?: string };
};

export default function AdminSettingsEdit({ adminNotificationEmail, flash }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        admin_notification_email: adminNotificationEmail,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="設定" />
            <div className="max-w-xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">設定</h1>

                {flash.success && (
                    <p className="mb-4 text-base text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2">
                        {flash.success}
                    </p>
                )}

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-1">
                                管理者通知メールアドレス
                            </label>
                            <p className="text-sm text-gray-500 mb-2">
                                新規注文が入った際に通知を送るメールアドレスを設定してください。
                            </p>
                            <input
                                type="email"
                                value={data.admin_notification_email}
                                onChange={(e) => setData('admin_notification_email', e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.admin_notification_email && (
                                <p className="text-red-500 text-sm mt-1">{errors.admin_notification_email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-md text-base font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                        >
                            保存する
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
