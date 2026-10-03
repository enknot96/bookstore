import AdminLayout from "@/Layouts/AdminLayout";
import { orderStatusColor } from "@/lib/orderStatus";
import { Head, Link } from "@inertiajs/react";
import { AlertTriangle, BookOpen, JapaneseYen, PackageCheck } from "lucide-react";

interface Stats {
    publishedBooks: number;
    pendingShipment: number;
    monthSales: number;
    lowStock: number;
}

interface RecentOrder {
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    user: { name: string } | null;
}

interface LowStockBook {
    id: number;
    title: string;
    stock: number;
}

interface Props {
    stats: Stats;
    recentOrders: RecentOrder[];
    lowStockBooks: LowStockBook[];
    statuses: Record<string, string>;
}

const statCards = (stats: Stats) => [
    {
        label: "公開中の書籍",
        value: stats.publishedBooks.toLocaleString(),
        icon: BookOpen,
        href: "/admin/books?is_published=1",
        color: "text-brand bg-brand-sand/50",
    },
    {
        label: "発送対応が必要な注文",
        value: stats.pendingShipment.toLocaleString(),
        icon: PackageCheck,
        href: "/admin/orders?status=confirmed",
        color: "text-orange-600 bg-orange-50",
    },
    {
        label: "今月の売上",
        value: `¥${stats.monthSales.toLocaleString()}`,
        icon: JapaneseYen,
        href: "/admin/orders",
        color: "text-green-600 bg-green-50",
    },
    {
        label: "在庫僅少の書籍",
        value: stats.lowStock.toLocaleString(),
        icon: AlertTriangle,
        href: "/admin/books?low_stock=1",
        color: "text-red-600 bg-red-50",
    },
];

export default function Dashboard({ stats, recentOrders, lowStockBooks, statuses }: Props) {
    return (
        <AdminLayout>
            <Head title="ダッシュボード" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {statCards(stats).map(({ label, value, icon: Icon, href, color }) => (
                        <Link
                            key={label}
                            href={href}
                            className="bg-white border rounded-lg p-5 flex items-center gap-4 hover:shadow-sm transition-shadow"
                        >
                            <div className={`p-3 rounded-lg ${color}`}>
                                <Icon size={22} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
                                <p className="text-base text-gray-500">{label}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white border rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-medium text-gray-700">直近の注文</h2>
                            <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                                すべて見る
                            </Link>
                        </div>
                        {recentOrders.length === 0 ? (
                            <p className="text-base text-gray-400 py-4">注文はまだありません</p>
                        ) : (
                            <ul className="divide-y">
                                {recentOrders.map((order) => (
                                    <li key={order.id}>
                                        <Link
                                            href={route("admin.orders.show", order.id)}
                                            className="flex items-center justify-between gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-base text-gray-900">
                                                    #{order.id} {order.user?.name ?? "（退会済み）"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString("ja-JP")}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-base text-gray-900">
                                                    ¥{order.total_amount.toLocaleString()}
                                                </p>
                                                <span
                                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${orderStatusColor(order.status)}`}
                                                >
                                                    {statuses[order.status] ?? order.status}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="bg-white border rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-base font-medium text-gray-700">在庫が少ない書籍</h2>
                            <Link href="/admin/books?low_stock=1" className="text-sm text-primary hover:underline">
                                すべて見る
                            </Link>
                        </div>
                        {lowStockBooks.length === 0 ? (
                            <p className="text-base text-gray-400 py-4">在庫僅少の書籍はありません</p>
                        ) : (
                            <ul className="divide-y">
                                {lowStockBooks.map((book) => (
                                    <li key={book.id}>
                                        <Link
                                            href={route("admin.books.edit", book.id)}
                                            className="flex items-center justify-between gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded"
                                        >
                                            <span className="text-base text-gray-900 line-clamp-1">{book.title}</span>
                                            <span
                                                className={`text-base font-medium shrink-0 ${book.stock === 0 ? "text-red-600" : "text-gray-700"}`}
                                            >
                                                {book.stock === 0 ? "在庫切れ" : `残り${book.stock}冊`}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

                <div className="bg-white border rounded-lg p-5">
                    <h2 className="text-base font-medium text-gray-700 mb-3">クイックリンク</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/admin/books/create" className="text-base text-primary hover:underline">
                            + 書籍を登録する
                        </Link>
                        <Link href="/admin/books" className="text-base text-primary hover:underline">
                            書籍一覧を見る
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
