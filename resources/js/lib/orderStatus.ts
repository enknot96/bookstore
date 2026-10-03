export const ORDER_STATUS_LABELS: Record<string, string> = {
    pending: '決済待ち',
    confirmed: '注文確定',
    processing: '処理中',
    shipped: '発送済み',
    delivered: '配達完了',
    cancelled: 'キャンセル',
};

const FALLBACK_COLOR = 'bg-gray-100 text-gray-800';

export const ORDER_STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-brand-sand text-brand',
    delivered: 'bg-green-100 text-green-800',
    cancelled: FALLBACK_COLOR,
};

export const orderStatusLabel = (status: string): string => ORDER_STATUS_LABELS[status] ?? status;

export const orderStatusColor = (status: string): string => ORDER_STATUS_COLORS[status] ?? FALLBACK_COLOR;
