export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-[#431608]/80 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
