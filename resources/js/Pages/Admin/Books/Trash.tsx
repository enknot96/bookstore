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
import AdminLayout from '@/Layouts/AdminLayout';
import { Book, PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArchiveRestore, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TrashedBook extends Book {
    deleted_at: string;
}

interface PaginatedTrashedBooks {
    data: TrashedBook[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props extends PageProps {
    books: PaginatedTrashedBooks;
    filters: { search?: string };
}

export default function Trash({ books, filters }: Props) {
    const { props } = usePage<PageProps & { flash?: { success?: string } }>();
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [emptyConfirmOpen, setEmptyConfirmOpen] = useState(false);
    const [bulkAction, setBulkAction] = useState<'restore' | 'force-delete' | null>(null);

    const applySearch = () => {
        router.get(route('admin.books.trash'), { search: search || undefined }, { preserveState: true });
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

    const handleRestore = (book: TrashedBook) => {
        router.patch(route('admin.books.restore', book.id), {}, { preserveScroll: true });
    };

    const handleForceDelete = (book: TrashedBook) => {
        if (!confirm(`「${book.title}」を完全に削除しますか？この操作は取り消せません。`)) return;
        router.delete(route('admin.books.force-delete', book.id), { preserveScroll: true });
    };

    const handleBulkRestore = () => {
        router.patch(route('admin.books.bulk-restore'), { ids: selectedIds }, {
            onSuccess: () => { setSelectedIds([]); setBulkAction(null); },
        });
    };

    const handleBulkForceDelete = () => {
        router.delete(route('admin.books.bulk-force-delete'), {
            data: { ids: selectedIds },
            onSuccess: () => { setSelectedIds([]); setBulkAction(null); },
        });
    };

    const handleEmptyTrash = () => {
        router.delete(route('admin.books.trash.empty'), {
            onSuccess: () => setEmptyConfirmOpen(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="ゴミ箱" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.books.index')}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <ArrowLeft size={14} />
                            書籍管理に戻る
                        </Link>
                        <h1 className="text-xl font-semibold">ゴミ箱</h1>
                        {books.total > 0 && (
                            <span className="text-sm text-gray-500">{books.total}件</span>
                        )}
                    </div>
                    {books.total > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setEmptyConfirmOpen(true)}
                        >
                            <Trash2 size={14} className="mr-1" />
                            ゴミ箱を空にする
                        </Button>
                    )}
                </div>

                {props.flash?.success && (
                    <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
                        {props.flash.success}
                    </div>
                )}

                {/* 検索 */}
                <div className="flex gap-2 bg-white border rounded-lg p-4">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                        placeholder="タイトル・著者で検索"
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
                    />
                    <Button variant="outline" size="sm" onClick={applySearch}>
                        検索
                    </Button>
                </div>

                {/* 一括操作バー */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                        <span className="text-sm text-blue-700">{selectedIds.length}件を選択中</span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => setBulkAction('restore')}
                        >
                            <ArchiveRestore size={14} className="mr-1" />
                            まとめて復元
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setBulkAction('force-delete')}
                        >
                            <Trash2 size={14} className="mr-1" />
                            まとめて完全削除
                        </Button>
                        <button
                            className="text-xs text-gray-500 hover:text-gray-700 ml-auto"
                            onClick={() => setSelectedIds([])}
                        >
                            選択解除
                        </button>
                    </div>
                )}

                {/* テーブル */}
                <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
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
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">タイトル</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600 hidden md:table-cell">著者</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-600 hidden sm:table-cell">状態</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600 hidden sm:table-cell">削除日時</th>
                                    <th className="px-4 py-3 w-32"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {books.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                            ゴミ箱は空です
                                        </td>
                                    </tr>
                                ) : (
                                    books.data.map((book) => (
                                        <tr key={book.id} className="hover:bg-gray-50 transition-colors opacity-75">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={selectedIds.includes(book.id)}
                                                    onChange={() => toggleSelect(book.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-700 line-clamp-1">{book.title}</div>
                                                <div className="text-xs text-gray-400 md:hidden">{book.author}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{book.author}</td>
                                            <td className="px-4 py-3 text-center hidden sm:table-cell">
                                                <Badge variant={book.is_published ? 'default' : 'secondary'}>
                                                    {book.is_published ? '公開' : '非公開'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                                                {new Date(book.deleted_at).toLocaleString('ja-JP')}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleRestore(book)}
                                                        className="text-xs text-green-700 hover:text-green-900 border border-green-200 hover:bg-green-50 rounded px-2 py-1 transition-colors"
                                                    >
                                                        復元
                                                    </button>
                                                    <button
                                                        onClick={() => handleForceDelete(book)}
                                                        className="text-xs text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 rounded px-2 py-1 transition-colors"
                                                    >
                                                        完全削除
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {books.last_page > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-600">
                            <span>
                                {books.total}件中 {(books.current_page - 1) * books.per_page + 1}〜
                                {Math.min(books.current_page * books.per_page, books.total)}件
                            </span>
                            <div className="flex gap-1">
                                {books.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`px-3 py-1 rounded border text-xs transition-colors ${
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

            {/* ゴミ箱を空にする確認ダイアログ */}
            <Dialog open={emptyConfirmOpen} onOpenChange={setEmptyConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ゴミ箱を空にしますか？</DialogTitle>
                        <DialogDescription>
                            {books.total}件の書籍をすべて完全に削除します。この操作は取り消せません。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEmptyConfirmOpen(false)}>
                            キャンセル
                        </Button>
                        <Button variant="destructive" onClick={handleEmptyTrash}>
                            すべて削除する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 一括復元確認ダイアログ */}
            <Dialog open={bulkAction === 'restore'} onOpenChange={(o) => !o && setBulkAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedIds.length}件を復元しますか？</DialogTitle>
                        <DialogDescription>
                            選択した書籍を書籍管理に戻します。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkAction(null)}>
                            キャンセル
                        </Button>
                        <Button onClick={handleBulkRestore}>
                            復元する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 一括完全削除確認ダイアログ */}
            <Dialog open={bulkAction === 'force-delete'} onOpenChange={(o) => !o && setBulkAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedIds.length}件を完全に削除しますか？</DialogTitle>
                        <DialogDescription>
                            この操作は取り消せません。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkAction(null)}>
                            キャンセル
                        </Button>
                        <Button variant="destructive" onClick={handleBulkForceDelete}>
                            完全削除する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
