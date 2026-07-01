import AdminLayout from '@/Layouts/AdminLayout';
import { Category, PageProps } from '@/types';
import { router, useForm } from '@inertiajs/react';
import BookForm from './BookForm';

interface Props extends PageProps {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        author: '',
        publisher: '',
        description: '',
        price: '',
        age_min: '',
        age_max: '',
        stock: '',
        is_published: false,
        cover_image_path: '',
        categories: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.books.store'));
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">書籍登録</h1>
                    <button
                        type="button"
                        onClick={() => router.visit(route('admin.books.index'))}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← 一覧に戻る
                    </button>
                </div>

                <div className="bg-white rounded-lg border p-6">
                    <BookForm
                        data={data}
                        errors={errors}
                        categories={categories}
                        processing={processing}
                        setData={setData}
                        onSubmit={handleSubmit}
                        submitLabel="登録する"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
