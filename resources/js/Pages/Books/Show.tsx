import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import BookCard from "@/Components/BookCard";
import Seo, { excerpt } from "@/Components/Seo";
import MainLayout from "@/Layouts/MainLayout";
import { PageProps } from "@/types";

type Category = {
    id: number;
    name: string;
    slug: string;
};

type Book = {
    id: number;
    title: string;
    author: string;
    publisher: string;
    description: string | null;
    price: number;
    age_min: number | null;
    age_max: number | null;
    stock: number;
    cover_image_path: string | null;
    categories: Category[];
};

type Props = {
    book: Book;
    related: Book[];
};

const MAX_PURCHASE_QUANTITY = 10;
const LOW_STOCK_THRESHOLD = 5;

function ageLabel(min: number | null, max: number | null): string {
    if (min === null && max === null) return "全年齢";
    if (min !== null && max !== null) return `${min}〜${max}歳`;
    if (min !== null) return `${min}歳以上`;
    return `${max}歳以下`;
}

export default function BookShow({ book, related }: Props) {
    const { auth } = usePage<PageProps>().props;

    const maxQuantity = Math.min(book.stock, MAX_PURCHASE_QUANTITY);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    const addToCart = () => {
        router.post(
            route('cart.store'),
            { book_id: book.id, quantity },
            { onStart: () => setAdding(true), onFinish: () => setAdding(false) },
        );
    };

    return (
        <>
            <Seo
                title={book.title}
                description={excerpt(book.description) ?? `${book.author}（${book.publisher}）の絵本です。`}
                image={book.cover_image_path}
                url={route("books.show", book.id)}
                type="product"
            />
            <MainLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* パンくず */}
                    <nav className="text-sm text-gray-500 mb-6 flex gap-2">
                        <Link
                            href={route("home")}
                            className="hover:text-brand-link"
                        >
                            トップ
                        </Link>
                        <span>/</span>
                        <Link
                            href={route("books.index")}
                            className="hover:text-brand-link"
                        >
                            本を探す
                        </Link>
                        <span>/</span>
                        <span className="text-gray-700 truncate max-w-xs">
                            {book.title}
                        </span>
                    </nav>

                    {/* 書籍詳細 */}
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row gap-8">
                        {/* 表紙 */}
                        {book.cover_image_path ? (
                            <img
                                src={book.cover_image_path}
                                alt={book.title}
                                decoding="async"
                                className="rounded-lg object-cover shrink-0 w-48 aspect-[3/4] mx-auto sm:mx-0 self-start"
                            />
                        ) : (
                            <div className="bg-brand-sand rounded-lg flex items-center justify-center text-8xl shrink-0 w-48 aspect-[3/4] mx-auto sm:mx-0 self-start">
                                📖
                            </div>
                        )}

                        {/* 情報 */}
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {book.categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={route("books.index", {
                                            category: cat.slug,
                                        })}
                                        className="text-xs bg-brand-sand text-brand px-2 py-0.5 rounded-full hover:bg-brand-sand-dark"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>

                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                {book.title}
                            </h1>
                            <p className="text-gray-600 mb-1">{book.author}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                {book.publisher}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                <span>
                                    対象年齢:{" "}
                                    <strong>
                                        {ageLabel(book.age_min, book.age_max)}
                                    </strong>
                                </span>
                                <span>
                                    在庫:{" "}
                                    <strong>
                                        {book.stock > 0
                                            ? `${book.stock}冊`
                                            : "在庫なし"}
                                    </strong>
                                    {book.stock > 0 &&
                                        book.stock <= LOW_STOCK_THRESHOLD && (
                                            <span className="ml-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                                                残りわずか
                                            </span>
                                        )}
                                </span>
                            </div>

                            <p className="text-3xl font-bold text-brand">
                                ¥{book.price.toLocaleString()}
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    税込・送料無料
                                </span>
                            </p>

                            {book.stock > 0 && auth.user && (
                                <div className="mt-4 flex items-center gap-2">
                                    <label
                                        htmlFor="quantity"
                                        className="text-sm text-gray-600"
                                    >
                                        数量
                                    </label>
                                    <select
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(Number(e.target.value))
                                        }
                                        className="w-20 border border-gray-300 rounded-md pl-3 pr-9 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    >
                                        {Array.from(
                                            { length: maxQuantity },
                                            (_, i) => i + 1,
                                        ).map((n) => (
                                            <option key={n} value={n}>
                                                {n}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mt-6">
                            {book.stock > 0 ? (
                                auth.user ? (
                                    <button
                                        onClick={addToCart}
                                        disabled={adding}
                                        className="inline-block bg-brand-sun text-brand px-8 py-3 rounded-full font-semibold hover:bg-brand-sun-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {adding ? "追加中..." : "カートに入れる"}
                                    </button>
                                ) : (
                                    <Link
                                        href={route("login", { redirect: route("books.show", book.id, false) })}
                                        className="inline-block bg-brand-sun text-brand px-8 py-3 rounded-full font-semibold hover:bg-brand-sun-hover transition"
                                    >
                                        カートに入れる（要ログイン）
                                    </Link>
                                )
                            ) : (
                                <button
                                    disabled
                                    className="inline-block bg-gray-300 text-gray-500 px-8 py-3 rounded-full font-semibold cursor-not-allowed"
                                >
                                    在庫切れ
                                </button>
                            )}
                            </div>

                            {book.description && (
                                <div className="mt-6 border-t pt-4">
                                    <h2 className="font-semibold text-gray-700 mb-2">
                                        あらすじ
                                    </h2>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                        {book.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 関連本 */}
                    {related.length > 0 && (
                        <section className="mt-12">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                関連する本
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {related.map((b) => (
                                    <BookCard key={b.id} book={b} compact />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </MainLayout>
        </>
    );
}
