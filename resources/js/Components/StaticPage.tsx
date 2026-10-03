import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import MainLayout from '@/Layouts/MainLayout';

/** 法定表記などの静的ページ共通レイアウト。ポートフォリオ用の架空店舗であることを明示する */
export default function StaticPage({ title, children }: { title: string; children: ReactNode }) {
    return (
        <MainLayout>
            <Head title={title} />
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold text-brand mb-6">{title}</h1>
                <p className="mb-8 text-sm text-brand bg-brand-sun/40 border border-brand-sun rounded px-4 py-3">
                    このサイトはポートフォリオ用に制作した架空の店舗です。掲載内容はすべてサンプルで、実在の事業者・商品・連絡先とは関係ありません。
                </p>
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">{children}</div>
            </div>
        </MainLayout>
    );
}
