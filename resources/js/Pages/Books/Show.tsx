import { Head, Link, router, usePage } from "@inertiajs/react";
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

function ageLabel(min: number | null, max: number | null): string {
    if (min === null && max === null) return "全年齢";
    if (min !== null && max !== null) return `${min}〜${max}歳`;
    if (min !== null) return `${min}歳以上`;
    return `${max}歳以下`;
}

export default function BookShow({ book, related }: Props) {
    const { auth } = usePage<PageProps>().props;

    const addToCart = () => {
        router.post(route('cart.store'), { book_id: book.id, quantity: 1 });
    };

    return (
        <>
            <Head title={`${book.title} | BookStore`} />
            <MainLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* パンくず */}
                    <nav className="text-sm text-gray-500 mb-6 flex gap-2">
                        <Link
                            href={route("home")}
                            className="hover:text-[#B27E6E]"
                        >
                            トップ
                        </Link>
                        <span>/</span>
                        <Link
                            href={route("books.index")}
                            className="hover:text-[#B27E6E]"
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
                                className="rounded-lg object-cover shrink-0 w-full sm:w-48 h-64"
                            />
                        ) : (
                            <div className="bg-[#EBDACA] rounded-lg flex items-center justify-center text-8xl shrink-0 w-full sm:w-48 h-64">
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
                                        className="text-xs bg-[#EBDACA] text-[#431608] px-2 py-0.5 rounded-full hover:bg-[#D8C7C2]"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>

                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                {book.title}
                            </h1>
                            <p className="text-gray-600 mb-1">{book.author}</p>
                            <p className="text-sm text-gray-400 mb-4">
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
                                </span>
                            </div>

                            <p className="text-3xl font-bold text-[#431608] mb-6">
                                ¥{book.price.toLocaleString()}
                            </p>

                            {book.stock > 0 ? (
                                auth.user ? (
                                    <button
                                        onClick={addToCart}
                                        className="inline-block bg-[#FFF17C] text-[#431608] px-8 py-3 rounded-full font-semibold hover:bg-[#ED946D] transition"
                                    >
                                        カートに入れる
                                    </button>
                                ) : (
                                    <Link
                                        href={route("login")}
                                        className="inline-block bg-[#FFF17C] text-[#431608] px-8 py-3 rounded-full font-semibold hover:bg-[#ED946D] transition"
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
                                    <Link
                                        key={b.id}
                                        href={route("books.show", b.id)}
                                        className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col"
                                    >
                                        {b.cover_image_path ? (
                                            <img
                                                src={b.cover_image_path}
                                                alt={b.title}
                                                className="w-full h-32 object-cover"
                                            />
                                        ) : (
                                            <div className="bg-[#EBDACA] h-32 flex items-center justify-center text-4xl">
                                                📖
                                            </div>
                                        )}
                                        <div className="p-3">
                                            <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                                                {b.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {b.author}
                                            </p>
                                            <p className="text-[#431608] font-bold text-sm mt-1">
                                                ¥{b.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </MainLayout>
        </>
    );
}
