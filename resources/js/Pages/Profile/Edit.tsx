import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit() {
    const { auth } = usePage<PageProps>().props;

    return (
        <MainLayout>
            <Head title="プロフィール編集" />
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <UpdateProfileInformationForm user={auth.user} />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <UpdatePasswordForm />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <DeleteUserForm />
                </div>
            </div>
        </MainLayout>
    );
}
