import { cn } from '@/lib/utils';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={cn(
                'inline-flex items-center justify-center rounded-full border border-transparent bg-brand px-5 py-2.5 text-sm font-semibold text-brand-cream transition duration-150 ease-in-out hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 active:bg-brand disabled:opacity-40',
                className,
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
