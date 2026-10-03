import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

/** サーバーからの Flash メッセージ（success / error）を toast で表示する */
export default function FlashToaster() {
    const flash = usePage<{ flash?: { success?: string; error?: string } }>().props.flash ?? {};

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    return <Toaster position="top-right" richColors />;
}
