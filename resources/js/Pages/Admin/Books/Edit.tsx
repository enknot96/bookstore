import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import AdminLayout from '@/Layouts/AdminLayout';
import { Book, Category, PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import BookForm from './BookForm';

interface Props extends PageProps {
    book: Book;
    categories: Category[];
}

export default function Edit({ book, categories }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        description: book.description ?? '',
        price: String(book.price),
        age_min: book.age_min != null ? String(book.age_min) : '',
        age_max: book.age_max != null ? String(book.age_max) : '',
        stock: String(book.stock),
        is_published: book.is_published,
        cover_image_path: book.cover_image_path ?? '',
        cover_image: null as File | null,
        categories: book.categories.map((c) => c.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.books.update', book.id));
    };

    const handleDelete = () => {
        router.delete(route('admin.books.destroy', book.id), {
            onSuccess: () => setConfirmOpen(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="書籍編集" />
            <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">書籍編集</h1>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmOpen(true)}
                        >
                            削除
                        </Button>
                        <button
                            type="button"
                            onClick={() => router.visit(route('admin.books.index'))}
                            className="text-base text-gray-500 hover:text-gray-700"
                        >
                            ← 一覧に戻る
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg border p-6">
                    <BookForm
                        data={data}
                        errors={errors}
                        categories={categories}
                        processing={processing}
                        setData={setData}
                        onSubmit={handleSubmit}
                        submitLabel="更新する"
                    />
                </div>
            </div>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>書籍を削除しますか？</DialogTitle>
                        <DialogDescription>
                            「{book.title}」を削除します。ゴミ箱から復元できます。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                            キャンセル
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            削除する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
