import StaticPage from '@/Components/StaticPage';

const SECTIONS: { heading: string; body: string }[] = [
    {
        heading: '1. 取得する情報',
        body: 'ご注文・会員登録の際に、お名前、メールアドレス、配送先の住所・郵便番号を取得します。クレジットカード情報は決済代行会社（Stripe）が直接取得し、当店では保持しません。',
    },
    {
        heading: '2. 利用目的',
        body: 'ご注文の処理・商品の発送、注文内容のご連絡、お問い合わせへの対応のために利用します。',
    },
    {
        heading: '3. 第三者への提供',
        body: '決済処理および配送に必要な範囲を除き、ご本人の同意なく個人情報を第三者に提供しません。',
    },
    {
        heading: '4. 情報の管理・削除',
        body: '取得した情報は適切に管理します。退会をご希望の場合は、マイページ（プロフィール編集）から手続きできます。',
    },
    {
        heading: '5. お問い合わせ',
        body: '個人情報の取り扱いに関するお問い合わせは、お問い合わせページに記載のメールアドレスまでご連絡ください。',
    },
];

export default function Privacy() {
    return (
        <StaticPage title="プライバシーポリシー">
            <div className="space-y-6">
                {SECTIONS.map((section) => (
                    <section key={section.heading}>
                        <h2 className="font-semibold text-gray-900 mb-2">{section.heading}</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">{section.body}</p>
                    </section>
                ))}
            </div>
        </StaticPage>
    );
}
