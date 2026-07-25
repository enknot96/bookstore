import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import AdminLayout from '@/Layouts/AdminLayout';
import { Category, PageProps, PaginatedBooks } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Filters {
    search?: string;
    category?: string;
    is_published?: string;
}

interface Props extends PageProps {
    books: PaginatedBooks;
    categories: Category[];
    filters: Filters;
    trashedCount: number;
}

export default function Index({ books, categories, filters, trashedCount }: Props) {
    const { props } = usePage<PageProps & { flash?: { success?: string } }>();
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

    const applyFilter = (overrides: Partial<Filters>) => {
        router.get(
            route('admin.books.index'),
            { ...filters, search, ...overrides },
            { preserveState: true, replace: true },
        );
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
        );
    };

    const toggleAll = () => {
        setSelectedIds((prev) =>
            prev.length === books.data.length ? [] : books.data.map((b) => b.id),
        );
    };

    const handleBulkDelete = () => {
        router.delete(route('admin.books.bulk-destroy'), {
            data: { ids: selectedIds },
            onSuccess: () => {
                setSelectedIds([]);
                setBulkConfirmOpen(false);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="書籍管理" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">書籍管理</h1>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.books.trash')}
                            className="flex items-center gap-1.5 text-base text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                        >
                            <Trash2 size={14} />
                            ゴミ箱
                            {trashedCount > 0 && (
                                <span className="bg-red-100 text-red-700 text-sm rounded-full px-1.5 py-0.5 font-medium">
                                    {trashedCount}
                                </span>
                            )}
                        </Link>
                        <Link href={route('admin.books.create')}>
                            <Button size="sm">
                                <Plus size={16} className="mr-1" />
                                新規登録
                            </Button>
                        </Link>
                    </div>
                </div>

                {props.flash?.success && (
                    <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-base text-green-700">
                        {props.flash.success}
                    </div>
                )}

                {/* フィルター */}
                <div className="flex flex-wrap gap-3 bg-white border rounded-lg p-4">
                    <Input
                        placeholder="タイトル・著者で検索"
                        className="w-52"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilter({ search })}
                    />
                    <Select
                        value={filters.category ?? ''}
                        onValueChange={(v) => applyFilter({ category: v || undefined })}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="カテゴリ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">すべて</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.is_published ?? ''}
                        onValueChange={(v) => applyFilter({ is_published: v || undefined })}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="公開状態" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">すべて</SelectItem>
                            <SelectItem value="1">公開</SelectItem>
                            <SelectItem value="0">非公開</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => applyFilter({ search })}>
                        検索
                    </Button>
                </div>

                {/* 一括削除バー */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                        <span className="text-base text-red-700">
                            {selectedIds.length}件を選択中
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setBulkConfirmOpen(true)}
                        >
                            <Trash2 size={14} className="mr-1" />
                            まとめて削除
                        </Button>
                        <button
                            className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
                            onClick={() => setSelectedIds([])}
                        >
                            選択解除
                        </button>
                    </div>
                )}

                {/* テーブル */}
                <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-base">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left w-10">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300"
                                            checked={
                                                books.data.length > 0 &&
                                                selectedIds.length === books.data.length
                                            }
                                            onChange={toggleAll}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                                        タイトル
                                    </th>
                                    <th className="px-4 py-3 w-36"></th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">
                                        著者
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-600 hidden sm:table-cell">
                                        価格
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-600 hidden sm:table-cell">
                                        在庫
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-600">
                                        状態
                                    </th>
                                    <th className="px-4 py-3 w-16"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {books.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-4 py-10 text-center text-gray-400"
                                        >
                                            書籍が見つかりません
                                        </td>
                                    </tr>
                                ) : (
                                    books.data.map((book) => (
                                        <tr
                                            key={book.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={selectedIds.includes(book.id)}
                                                    onChange={() => toggleSelect(book.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900 line-clamp-1">
                                                    {book.title}
                                                </div>
                                                <div className="text-sm text-gray-400 md:hidden">
                                                    {book.author}
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">
                                                {book.cover_image_path ? (
                                                    <img
                                                        src={book.cover_image_path}
                                                        alt={book.title}
                                                        className="w-full h-28 object-cover rounded shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-full h-28 bg-gray-100 rounded flex items-center justify-center text-2xl">
                                                        📖
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                                                {book.author}
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-700 hidden sm:table-cell">
                                                ¥{book.price.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right hidden sm:table-cell">
                                                <span
                                                    className={
                                                        book.stock === 0
                                                            ? 'text-red-500'
                                                            : 'text-gray-700'
                                                    }
                                                >
                                                    {book.stock}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge
                                                    variant={
                                                        book.is_published ? 'default' : 'secondary'
                                                    }
                                                >
                                                    {book.is_published ? '公開' : '非公開'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={route('admin.books.edit', book.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil size={15} />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ページネーション */}
                    {books.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t text-base text-gray-600">
                            <span>
                                {books.total}件中 {(books.current_page - 1) * books.per_page + 1}〜
                                {Math.min(books.current_page * books.per_page, books.total)}件
                            </span>
                            <div className="flex gap-1">
                                {books.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`px-3 py-1 rounded border text-sm transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : link.url
                                                  ? 'hover:bg-gray-100 border-gray-200'
                                                  : 'opacity-40 cursor-not-allowed border-gray-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 一括削除確認ダイアログ */}
            <Dialog open={bulkConfirmOpen} onOpenChange={setBulkConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedIds.length}件を削除しますか？</DialogTitle>
                        <DialogDescription>
                            選択した書籍をまとめて削除します。ゴミ箱から復元できます。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkConfirmOpen(false)}>
                            キャンセル
                        </Button>
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            削除する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
