import { Head, Link } from "@inertiajs/react";
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

type Props = {
    newArrivals: Book[];
    categories: Category[];
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
                    className="w-full h-48 object-cover"
                />
            ) : (
                <div className="bg-[#EBDACA] h-48 flex items-center justify-center text-6xl">
                    📖
                </div>
            )}
            <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-500 mb-1">
                    {book.categories.map((c) => c.name).join(" / ")}
                </p>
                <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                <p className="text-[#431608] font-bold mt-2">
                    ¥{book.price.toLocaleString()}
                </p>
            </div>
        </Link>
    );
}

export default function Home({ newArrivals, categories }: Props) {
    return (
        <>
            <Head title="トップ | BookStore" />
            <MainLayout>
                {/* Hero */}
                <section className="bg-[#431608] text-[#FDFAEB] py-20 px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        子供の本の世界へ
                    </h1>
                    <p className="text-[#EBDACA] mb-8 text-lg">
                        年齢・ジャンルから、ぴったりの一冊を見つけよう
                    </p>
                    <Link
                        href={route("books.index")}
                        className="bg-[#FFF17C] text-[#431608] font-semibold px-6 py-3 rounded-full hover:bg-[#ED946D] transition"
                    >
                        本を探す
                    </Link>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 新着本 */}
                    {newArrivals.length > 0 && (
                        <section className="mt-16">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-[#431608]">
                                    新着本
                                </h2>
                                <Link
                                    href={route("books.index")}
                                    className="text-[#B27E6E] text-sm hover:underline"
                                >
                                    すべて見る →
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {newArrivals.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* カテゴリ */}
                    {categories.length > 0 && (
                        <section className="mt-16 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                カテゴリ別に探す
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={route("books.index", {
                                            category: cat.slug,
                                        })}
                                        className="bg-white border border-[#431608]/20 rounded-lg p-4 text-center font-medium text-[#431608]/80 hover:border-[#B27E6E] hover:text-[#B27E6E] transition"
                                    >
                                        {cat.name}
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
