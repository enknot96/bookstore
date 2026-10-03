import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/** Laravel のページネーションが返すラベル（英語・HTMLエンティティ）を表示用に変換する */
const toLabel = (label: string): string => {
    if (label.includes('Previous')) return '前へ';
    if (label.includes('Next')) return '次へ';
    return label;
};

export default function Pagination({ links, className }: { links: PaginationLink[]; className?: string }) {
    if (links.length <= 3) return null;

    return (
        <nav aria-label="ページ送り" className={cn('flex flex-wrap justify-center gap-1.5', className)}>
            {links.map((link, i) => {
                const label = toLabel(link.label);
                const base = 'min-w-9 px-3 py-1.5 rounded-md border text-sm text-center';

                if (!link.url) {
                    return (
                        <span key={i} className={cn(base, 'border-transparent text-gray-500')}>
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        aria-current={link.active ? 'page' : undefined}
                        className={cn(
                            base,
                            link.active
                                ? 'bg-brand text-brand-cream border-brand'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
