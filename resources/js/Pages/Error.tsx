import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

const MESSAGES: Record<number, { title: string; description: string }> = {
    403: {
        title: 'アクセスできません',
        description: 'このページを表示する権限がありません。',
    },
    404: {
        title: 'ページが見つかりません',
        description: 'お探しのページは移動または削除された可能性があります。',
    },
    500: {
        title: 'エラーが発生しました',
        description: 'ご不便をおかけします。時間をおいてもう一度お試しください。',
    },
    503: {
        title: 'ただいまメンテナンス中です',
        description: 'しばらくしてからもう一度アクセスしてください。',
    },
};

export default function Error({ status }: { status: number }) {
    const { title, description } = MESSAGES[status] ?? MESSAGES[500];

    return (
        <MainLayout>
            <Head title={title} />
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <p className="text-6xl mb-6" aria-hidden="true">
                    📚
                </p>
                <p className="text-sm text-gray-500 mb-2">エラー {status}</p>
                <h1 className="text-2xl font-bold text-brand mb-4">{title}</h1>
                <p className="text-gray-600 mb-8">{description}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={route('home')}
                        className="bg-brand-sun text-brand px-6 py-2.5 rounded-full font-semibold hover:bg-brand-sun-hover transition"
                    >
                        トップへ戻る
                    </Link>
                    <Link
                        href={route('books.index')}
                        className="border border-brand/30 text-brand px-6 py-2.5 rounded-full font-medium hover:bg-white transition"
                    >
                        本を探す
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
