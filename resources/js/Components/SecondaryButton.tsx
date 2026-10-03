import { cn } from '@/lib/utils';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={cn(
                'inline-flex items-center justify-center rounded-full border border-brand/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand shadow-sm transition duration-150 ease-in-out hover:bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 disabled:opacity-40',
                className,
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
