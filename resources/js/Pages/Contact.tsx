import StaticPage from '@/Components/StaticPage';

export default function Contact() {
    return (
        <StaticPage title="お問い合わせ">
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>ご注文やサイトについてのお問い合わせは、下記のメールアドレスまでお願いします。</p>
                <p>
                    <a
                        href="mailto:info@example.com"
                        className="text-lg font-medium text-brand-link hover:underline"
                    >
                        info@example.com
                    </a>
                </p>
                <p className="text-gray-500">
                    受付時間：平日 10:00〜17:00（架空）。返信までに2営業日ほどいただく場合があります。
                </p>
            </div>
        </StaticPage>
    );
}
