import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import BookCard from "@/Components/BookCard";
import MainLayout from "@/Layouts/MainLayout";
import { AGE_BANDS } from "@/lib/ageBands";
import hero01 from "@/assets/hero/hero01.jpg";
import hero02 from "@/assets/hero/hero02.jpg";
import hero03 from "@/assets/hero/hero03.jpg";

const HERO_IMAGES = [hero01, hero02, hero03];
const HERO_INTERVAL_MS = 5000;

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
    books_count?: number;
};

type Props = {
    newArrivals: Book[];
    categories: Category[];
};

export default function Home({ newArrivals, categories }: Props) {
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, HERO_INTERVAL_MS);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="トップ" />
            <MainLayout>
                {/* Hero */}
                <section className="relative h-[420px] sm:h-[480px] overflow-hidden text-brand-cream">
                    {HERO_IMAGES.map((src, i) => (
                        <img
                            key={src}
                            src={src}
                            alt=""
                            aria-hidden="true"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                i === heroIndex ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-brand/40" />

                    <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-4xl font-bold mb-4 drop-shadow">
                            木もれびの下で、{" "}
                            <br className="hidden max-[660px]:inline" />
                            お気に入りの一冊を
                        </h1>
                        <p className="text-brand-sand mb-8 text-lg drop-shadow">
                            年齢やジャンルから、お子さまにぴったりの絵本をさがせます
                        </p>
                        <Link
                            href={route("books.index")}
                            className="bg-brand-sun text-brand font-semibold px-6 py-3 rounded-full hover:bg-brand-sun-hover transition"
                        >
                            本を探す
                        </Link>
                    </div>

                    <svg
                        className="absolute -bottom-1 left-0 w-full h-16 sm:h-20"
                        viewBox="0 0 1440 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M0,100 L0,80 C 360,-20 1080,-20 1440,80 L1440,100 Z"
                            className="fill-brand-cream"
                        />
                    </svg>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* 新着本 */}
                    {newArrivals.length > 0 && (
                        <section className="mt-16">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-brand">
                                    新着本
                                </h2>
                                <Link
                                    href={route("books.index")}
                                    className="text-brand-accent text-sm hover:underline"
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

                    {/* 年齢から探す */}
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-brand mb-6">
                            年齢から探す
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {AGE_BANDS.map((band) => (
                                <Link
                                    key={band.key}
                                    href={route("books.index", {
                                        age_band: band.key,
                                    })}
                                    className="bg-brand-sun/60 text-brand rounded-2xl py-6 text-center text-lg font-bold hover:bg-brand-sun transition"
                                >
                                    {band.label}
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* カテゴリ */}
                    {categories.length > 0 && (
                        <section className="mt-16 mb-8">
                            <h2 className="text-2xl font-bold text-brand mb-6">
                                カテゴリ別に探す
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={route("books.index", {
                                            category: cat.slug,
                                        })}
                                        className="bg-white border border-brand/20 rounded-lg p-4 text-center font-medium text-brand/80 hover:border-brand-accent hover:text-brand-accent transition"
                                    >
                                        {cat.name}
                                        {cat.books_count !== undefined && (
                                            <span className="ml-1 text-xs font-normal text-gray-500">
                                                （{cat.books_count}冊）
                                            </span>
                                        )}
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
