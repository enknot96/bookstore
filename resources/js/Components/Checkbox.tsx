export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-[#431608]/30 text-[#431608] shadow-sm focus:ring-[#B27E6E] ' +
                className
            }
        />
    );
}
