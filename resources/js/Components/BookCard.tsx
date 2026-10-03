import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export type BookCardBook = {
    id: number;
    title: string;
    author: string;
    price: number;
    cover_image_path: string | null;
    categories?: { id: number; name: string }[];
};

type Props = {
    book: BookCardBook;
    /** compact: 関連本など小さめの表示 */
    compact?: boolean;
};

export default function BookCard({ book, compact = false }: Props) {
    return (
        <Link
            href={route('books.show', book.id)}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            {book.cover_image_path ? (
                <img
                    src={book.cover_image_path}
                    alt={book.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[3/4] object-cover"
                />
            ) : (
                <div
                    className={cn(
                        'bg-brand-sand w-full aspect-[3/4] flex items-center justify-center',
                        compact ? 'text-4xl' : 'text-6xl',
                    )}
                >
                    📖
                </div>
            )}
            <div className={cn('flex flex-col flex-1', compact ? 'p-3' : 'p-4')}>
                {!compact && book.categories && (
                    <p className="text-xs text-gray-500 mb-1 truncate">
                        {book.categories.map((c) => c.name).join(' / ')}
                    </p>
                )}
                <h3 className={cn('font-semibold text-gray-800 line-clamp-2 flex-1', compact && 'text-sm')}>
                    {book.title}
                </h3>
                <p className={cn('text-gray-500 mt-1', compact ? 'text-xs' : 'text-sm')}>{book.author}</p>
                <p className={cn('text-brand font-bold', compact ? 'text-sm mt-1' : 'mt-2')}>
                    ¥{book.price.toLocaleString()}
                </p>
            </div>
        </Link>
    );
}
