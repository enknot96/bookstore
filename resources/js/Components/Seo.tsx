import { Head } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

type Props = {
    title: string;
    description?: string | null;
    image?: string | null;
    url?: string;
    type?: 'website' | 'product';
};

/** 説明文用に、改行を空白にして指定の長さで切り詰める */
export const excerpt = (text: string | null | undefined, max = 120): string | undefined => {
    if (!text) return undefined;
    const flat = text.replace(/\s+/g, ' ').trim();
    return flat.length > max ? `${flat.slice(0, max)}…` : flat;
};

/** ページごとの description と OGP を設定する（既定値は app.blade.php） */
export default function Seo({ title, description, image, url, type = 'website' }: Props) {
    return (
        <Head title={title}>
            {description && <meta head-key="description" name="description" content={description} />}
            {description && <meta head-key="og:description" property="og:description" content={description} />}
            <meta head-key="og:title" property="og:title" content={`${title} - ${appName}`} />
            <meta head-key="og:type" property="og:type" content={type} />
            {image && <meta head-key="og:image" property="og:image" content={image} />}
            {url && <meta head-key="og:url" property="og:url" content={url} />}
        </Head>
    );
}
