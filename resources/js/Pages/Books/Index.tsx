import { Head, Link, router } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";

type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    cover_image_path: string | null;
    categories: { id: number; name: string }[];
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

type PaginatedBooks = {
    data: Book[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    from: number;
    to: number;
    total: number;
};

type Filters = {
    keyword?: string;
    category?: string;
    price_min?: string;
    price_max?: string;
    age?: string;
};

type Props = {
    books: PaginatedBooks;
    categories: Category[];
    filters: Filters;
};

function BookCard({ book }: { book: Book }) {
    return (
        <Link
            href={route("books.show", book.id)}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            {book.cover_image_path ? (
                <img
                    src={book.cover_image_path}
                    alt={book.title}
                    className="w-full h-40 object-cover"
                />
            ) : (
                <div className="bg-indigo-50 h-40 flex items-center justify-center text-5xl">
                    📖
                </div>
            )}
            <div className="p-3 flex flex-col flex-1">
                <p className="text-xs text-gray-500 mb-1 truncate">
                    {book.categories.map((c) => c.name).join(" / ")}
                </p>
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 flex-1">
                    {book.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                <p className="text-indigo-600 font-bold mt-2 text-sm">
                    ¥{book.price.toLocaleString()}
                </p>
            </div>
        </Link>
    );
}

export default function BooksIndex({ books, categories, filters }: Props) {
    const [form, setForm] = useState<Filters>(filters);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const params = Object.fromEntries(
            Object.entries(form).filter(([, v]) => v !== "" && v !== undefined),
        );
        router.get(route("books.index"), params, { preserveState: true });
    }

    function handleReset() {
        setForm({});
        router.get(route("books.index"));
    }

    return (
        <>
            <Head title="本を探す | BookStore" />
            <MainLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        本を探す
                    </h1>

                    {/* フィルター */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-lg shadow p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
                    >
                        {/* キーワード */}
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                キーワード（タイトル・著者）
                            </label>
                            <input
                                type="text"
                                value={form.keyword ?? ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        keyword: e.target.value,
                                    })
                                }
                                placeholder="例：絵本、あいうえお"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {/* カテゴリ */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                カテゴリ
                            </label>
                            <select
                                value={form.category ?? ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">すべて</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 価格帯 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                価格帯（円）
                            </label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={form.price_min ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            price_min: e.target.value,
                                        })
                                    }
                                    placeholder="下限"
                                    min={0}
                                    className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                <span className="text-gray-400 text-sm shrink-0">
                                    〜
                                </span>
                                <input
                                    type="number"
                                    value={form.price_max ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            price_max: e.target.value,
                                        })
                                    }
                                    placeholder="上限"
                                    min={0}
                                    className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </div>

                        {/* 対象年齢 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                対象年齢（歳）
                            </label>
                            <input
                                type="number"
                                value={form.age ?? ""}
                                onChange={(e) =>
                                    setForm({ ...form, age: e.target.value })
                                }
                                placeholder="例：5"
                                min={0}
                                max={18}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {/* ボタン */}
                        <div className="flex gap-2 lg:col-span-5">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
                            >
                                検索
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition"
                            >
                                リセット
                            </button>
                        </div>
                    </form>

                    {/* 件数 */}
                    <p className="text-sm text-gray-500 mb-4">
                        {books.total} 件中 {books.from ?? 0}〜{books.to ?? 0}{" "}
                        件表示
                    </p>

                    {/* 一覧 */}
                    {books.data.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {books.data.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-4xl mb-4">📭</p>
                            <p>該当する本が見つかりませんでした</p>
                        </div>
                    )}

                    {/* ページネーション */}
                    {books.last_page > 1 && (
                        <div className="flex justify-center gap-3 mt-10">
                            {books.prev_page_url && (
                                <Link
                                    href={books.prev_page_url}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    ← 前へ
                                </Link>
                            )}
                            <span className="px-4 py-2 text-sm text-gray-600">
                                {books.current_page} / {books.last_page}
                            </span>
                            {books.next_page_url && (
                                <Link
                                    href={books.next_page_url}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    次へ →
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </MainLayout>
        </>
    );
}
