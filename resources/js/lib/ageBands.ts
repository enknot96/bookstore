/** 書籍一覧の年齢帯。key はバックエンド（BookController::AGE_BANDS）と一致させる */
export const AGE_BANDS = [
    { key: '0-2', label: '0〜2歳' },
    { key: '3-5', label: '3〜5歳' },
    { key: '6-8', label: '6〜8歳' },
    { key: '9+', label: '9歳以上' },
] as const;

export const ageBandLabel = (key: string): string => AGE_BANDS.find((b) => b.key === key)?.label ?? key;
