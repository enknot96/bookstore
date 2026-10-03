import { router } from "@inertiajs/react";
import { ChevronDown, X } from "lucide-react";
import { FormEvent, useState } from "react";
import BookCard, { BookCardBook } from "@/Components/BookCard";
import Pagination, { PaginationLink } from "@/Components/Pagination";
import Seo from "@/Components/Seo";
import MainLayout from "@/Layouts/MainLayout";
import { AGE_BANDS, ageBandLabel } from "@/lib/ageBands";
import { cn } from "@/lib/utils";

type Category = {
    id: number;
    name: string;
    slug: string;
};

type PaginatedBooks = {
    data: BookCardBook[];
    links: PaginationLink[];
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Filters = {
    keyword?: string;
    category?: string;
    price_min?: string;
    price_max?: string;
    age_band?: string;
    sort?: string;
};

type Props = {
    books: PaginatedBooks;
    categories: Category[];
    filters: Filters;
};

const SORT_OPTIONS = [
    { value: "", label: "新着順" },
    { value: "price_asc", label: "価格の安い順" },
    { value: "price_desc", label: "価格の高い順" },
];

const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent";

/** 空の値を除いたクエリパラメータにする */
const compact = (params: Filters): Filters =>
    Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "" && v !== undefined),
    );

export default function BooksIndex({ books, categories, filters }: Props) {
    const [text, setText] = useState({
        keyword: filters.keyword ?? "",
        price_min: filters.price_min ?? "",
        price_max: filters.price_max ?? "",
    });
    const [filterOpen, setFilterOpen] = useState(
        () => typeof window === "undefined" || window.innerWidth >= 640,
    );

    // 適用中の条件を基準に、一部だけ差し替えて検索する
    const search = (overrides: Filters = {}) => {
        router.get(
            route("books.index"),
            compact({ ...filters, ...text, ...overrides }),
            { preserveState: true },
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        search();
    };

    const clearAll = () => {
        setText({ keyword: "", price_min: "", price_max: "" });
        router.get(route("books.index"), compact({ sort: filters.sort }));
    };

    const removeFilter = (keys: (keyof Filters)[]) => {
        const next = { ...text };
        keys.forEach((k) => {
            if (k in next) next[k as keyof typeof next] = "";
        });
        setText(next);
        router.get(
            route("books.index"),
            compact({
                ...filters,
                ...next,
                ...Object.fromEntries(keys.map((k) => [k, undefined])),
            }),
            { preserveState: true },
        );
    };

    const categoryName = categories.find((c) => c.slug === filters.category)?.name;
    const priceLabel =
        filters.price_min || filters.price_max
            ? `¥${filters.price_min ? Number(filters.price_min).toLocaleString() : ""}〜${filters.price_max ? `¥${Number(filters.price_max).toLocaleString()}` : ""}`
            : null;

    const activeChips = [
        filters.keyword && { label: `キーワード: ${filters.keyword}`, keys: ["keyword"] as (keyof Filters)[] },
        categoryName && { label: `カテゴリ: ${categoryName}`, keys: ["category"] as (keyof Filters)[] },
        filters.age_band && { label: `年齢: ${ageBandLabel(filters.age_band)}`, keys: ["age_band"] as (keyof Filters)[] },
        priceLabel && { label: `価格: ${priceLabel}`, keys: ["price_min", "price_max"] as (keyof Filters)[] },
    ].filter(Boolean) as { label: string; keys: (keyof Filters)[] }[];

    return (
        <>
            <Seo
                title="本を探す"
                description="タイトル・著者・カテゴリ・対象年齢から、お子さまにぴったりの絵本をさがせます。"
                url={route("books.index")}
            />
            <MainLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-2xl font-bold text-brand mb-6">
                        本を探す
                    </h1>

                    {/* 年齢帯 */}
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                            対象年齢から選ぶ
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {AGE_BANDS.map((band) => {
                                const active = filters.age_band === band.key;
                                return (
                                    <button
                                        key={band.key}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() =>
                                            search({ age_band: active ? undefined : band.key })
                                        }
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-sm border transition-colors",
                                            active
                                                ? "bg-brand text-brand-cream border-brand"
                                                : "bg-white text-brand border-brand/30 hover:border-brand-accent hover:text-brand-link",
                                        )}
                                    >
                                        {band.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* フィルター */}
                    <div className="bg-white rounded-lg shadow mb-4">
                        <button
                            type="button"
                            onClick={() => setFilterOpen((v) => !v)}
                            aria-expanded={filterOpen}
                            aria-controls="book-filter-form"
                            className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-brand sm:cursor-default"
                        >
                            <span>
                                絞り込み
                                {activeChips.length > 0 && `（${activeChips.length}件適用中）`}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "w-4 h-4 transition-transform sm:hidden",
                                    filterOpen && "rotate-180",
                                )}
                            />
                        </button>

                        <form
                            id="book-filter-form"
                            onSubmit={handleSubmit}
                            className={cn(
                                "px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end",
                                !filterOpen && "hidden sm:grid",
                            )}
                        >
                            <div className="lg:col-span-2">
                                <label htmlFor="keyword" className="block text-xs font-medium text-gray-600 mb-1">
                                    キーワード（タイトル・著者）
                                </label>
                                <input
                                    id="keyword"
                                    type="text"
                                    value={text.keyword}
                                    onChange={(e) => setText({ ...text, keyword: e.target.value })}
                                    placeholder="例：絵本、あいうえお"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-xs font-medium text-gray-600 mb-1">
                                    カテゴリ
                                </label>
                                <select
                                    id="category"
                                    value={filters.category ?? ""}
                                    onChange={(e) => search({ category: e.target.value })}
                                    className={`${inputClass} pr-9`}
                                >
                                    <option value="">すべて</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="price_min" className="block text-xs font-medium text-gray-600 mb-1">
                                    価格帯（円）
                                </label>
                                <div className="flex items-center gap-1">
                                    <input
                                        id="price_min"
                                        type="number"
                                        value={text.price_min}
                                        onChange={(e) => setText({ ...text, price_min: e.target.value })}
                                        placeholder="下限"
                                        min={0}
                                        aria-label="価格の下限"
                                        className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    />
                                    <span className="text-gray-500 text-sm shrink-0">〜</span>
                                    <input
                                        type="number"
                                        value={text.price_max}
                                        onChange={(e) => setText({ ...text, price_max: e.target.value })}
                                        placeholder="上限"
                                        min={0}
                                        aria-label="価格の上限"
                                        className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
                                <button
                                    type="submit"
                                    className="bg-brand text-brand-cream px-5 py-2 rounded-md text-sm hover:bg-brand-link transition"
                                >
                                    検索
                                </button>
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition"
                                >
                                    リセット
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 適用中の条件 */}
                    {activeChips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {activeChips.map((chip) => (
                                <span
                                    key={chip.label}
                                    className="inline-flex items-center gap-1 bg-brand-sand text-brand text-sm rounded-full pl-3 pr-1.5 py-1"
                                >
                                    {chip.label}
                                    <button
                                        type="button"
                                        onClick={() => removeFilter(chip.keys)}
                                        aria-label={`${chip.label}を解除`}
                                        className="rounded-full p-0.5 hover:bg-brand/10"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            ))}
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-sm text-brand-link hover:underline ml-1"
                            >
                                すべてクリア
                            </button>
                        </div>
                    )}

                    {/* 件数・並び替え */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <p className="text-sm text-gray-500" aria-live="polite">
                            {books.total} 件中 {books.from ?? 0}〜{books.to ?? 0} 件表示
                        </p>
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort" className="text-sm text-gray-600">
                                並び替え
                            </label>
                            <select
                                id="sort"
                                value={filters.sort ?? ""}
                                onChange={(e) => search({ sort: e.target.value })}
                                className="border border-gray-300 rounded-md pl-3 pr-9 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 一覧 */}
                    {books.data.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {books.data.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-4xl mb-4">📭</p>
                            <p className="mb-4">該当する本が見つかりませんでした</p>
                            {activeChips.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="text-brand-link hover:underline text-sm"
                                >
                                    条件をクリアしてすべての本を見る
                                </button>
                            )}
                        </div>
                    )}

                    <Pagination links={books.links} className="mt-10" />
                </div>
            </MainLayout>
        </>
    );
}
