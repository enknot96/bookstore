export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-full border border-transparent bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-cream transition duration-150 ease-in-out hover:bg-[#5a2411] focus:bg-[#5a2411] focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 active:bg-[#2e0e05] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
