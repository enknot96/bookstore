export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-brand/30 text-brand shadow-sm focus:ring-brand-accent ' +
                className
            }
        />
    );
}
