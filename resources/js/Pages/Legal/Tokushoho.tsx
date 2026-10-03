import StaticPage from '@/Components/StaticPage';

const ROWS: [string, string][] = [
    ['販売事業者', 'こもれび書房（架空）'],
    ['運営責任者', '（架空）'],
    ['所在地', '〒000-0000 東京都○○区○○ 1-2-3（架空）'],
    ['電話番号', '03-0000-0000（架空）'],
    ['メールアドレス', 'info@example.com'],
    ['販売価格', '各商品ページに表示された価格（税込）'],
    ['商品代金以外の必要料金', '送料は全国一律無料です。'],
    ['お支払い方法', 'クレジットカード（Stripe による決済）'],
    ['お支払い時期', 'ご注文時に決済が行われます。'],
    ['商品のお届け時期', 'ご注文確定後、3〜5営業日以内に発送します。'],
    ['返品・交換', '商品に不備があった場合は、到着後7日以内にメールでご連絡ください。お客様都合の返品はお受けしておりません。'],
];

export default function Tokushoho() {
    return (
        <StaticPage title="特定商取引法に基づく表記">
            <dl className="divide-y divide-gray-200">
                {ROWS.map(([term, description]) => (
                    <div key={term} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-700">{term}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{description}</dd>
                    </div>
                ))}
            </dl>
        </StaticPage>
    );
}
