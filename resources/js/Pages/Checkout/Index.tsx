import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CartItem } from '@/types';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

type Props = {
    cartItems: CartItem[];
    total: number;
};

type ShippingForm = {
    shipping_name: string;
    shipping_zip: string;
    shipping_address: string;
};

function CheckoutForm({ total, cartItems }: Props) {
    const stripe = useStripe();
    const elements = useElements();

    const [shipping, setShipping] = useState<ShippingForm>({
        shipping_name: '',
        shipping_zip: '',
        shipping_address: '',
    });
    const [errors, setErrors] = useState<Partial<ShippingForm>>({});
    const [processing, setProcessing] = useState(false);
    const [stripeError, setStripeError] = useState<string | null>(null);

    const validate = (): boolean => {
        const e: Partial<ShippingForm> = {};
        if (!shipping.shipping_name) e.shipping_name = '氏名を入力してください。';
        if (!shipping.shipping_zip) e.shipping_zip = '郵便番号を入力してください。';
        if (!shipping.shipping_address) e.shipping_address = '住所を入力してください。';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !validate()) return;

        setProcessing(true);
        setStripeError(null);

        // Payment Element の入力バリデーション（非同期処理の前に必須）
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setStripeError(submitError.message ?? '入力内容を確認してください。');
            setProcessing(false);
            return;
        }

        try {
            const res = await fetch(route('checkout.prepare'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
                body: JSON.stringify(shipping),
            });

            if (!res.ok) {
                const data = await res.json();
                setStripeError(data.error ?? 'エラーが発生しました。');
                setProcessing(false);
                return;
            }

            const { clientSecret } = await res.json();

            const result = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: route('checkout.complete'),
                },
            });

            if (result.error) {
                setStripeError(result.error.message ?? '決済に失敗しました。');
            }
        } catch {
            setStripeError('通信エラーが発生しました。');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* 配送先 */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">配送先</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                        <input
                            type="text"
                            value={shipping.shipping_name}
                            onChange={(e) => setShipping({ ...shipping, shipping_name: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="山田 太郎"
                        />
                        {errors.shipping_name && <p className="text-red-500 text-xs mt-1">{errors.shipping_name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">郵便番号</label>
                        <input
                            type="text"
                            value={shipping.shipping_zip}
                            onChange={(e) => setShipping({ ...shipping, shipping_zip: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="123-4567"
                        />
                        {errors.shipping_zip && <p className="text-red-500 text-xs mt-1">{errors.shipping_zip}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
                        <input
                            type="text"
                            value={shipping.shipping_address}
                            onChange={(e) => setShipping({ ...shipping, shipping_address: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="東京都渋谷区..."
                        />
                        {errors.shipping_address && <p className="text-red-500 text-xs mt-1">{errors.shipping_address}</p>}
                    </div>
                </div>
            </section>

            {/* 支払い */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">お支払い情報</h2>
                <div className="border border-gray-200 rounded-md p-4">
                    <PaymentElement />
                </div>
            </section>

            {/* 注文内容確認 */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">注文内容</h2>
                <div className="bg-gray-50 rounded-md divide-y divide-gray-200">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center px-4 py-3 text-sm">
                            <span className="text-gray-700">
                                {item.book.title} × {item.quantity}
                            </span>
                            <span className="font-medium">¥{item.subtotal.toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center px-4 py-3 font-semibold">
                        <span>合計</span>
                        <span className="text-indigo-600">¥{total.toLocaleString()}</span>
                    </div>
                </div>
            </section>

            {stripeError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-4 py-2">
                    {stripeError}
                </p>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
                {processing ? '処理中...' : `¥${total.toLocaleString()} を支払う`}
            </button>
        </form>
    );
}

export default function CheckoutIndex({ cartItems, total }: Props) {
    const options: StripeElementsOptions = {
        mode: 'payment',
        amount: total,
        currency: 'jpy',
    };

    return (
        <MainLayout>
            <Head title="チェックアウト" />
            <div className="max-w-xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">チェックアウト</h1>
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm cartItems={cartItems} total={total} />
                </Elements>
            </div>
        </MainLayout>
    );
}
