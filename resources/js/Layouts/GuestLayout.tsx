import logo from '@/assets/logo/logo.webp';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-brand-cream pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="flex flex-col items-center gap-2">
                    <img src={logo} alt="こもれび書房" className="h-20 w-20 object-contain rounded-full" />
                    <span className="text-lg font-bold text-brand">こもれび書房</span>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md border border-brand/10 sm:max-w-lg sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
