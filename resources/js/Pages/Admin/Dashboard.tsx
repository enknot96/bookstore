import AdminLayout from "@/Layouts/AdminLayout";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { BookOpen, FolderOpen, ShoppingCart } from "lucide-react";

interface Stats {
    books: number;
    categories: number;
    orders: number;
}

interface Props extends PageProps {
    stats: Stats;
}

const statCards = (stats: Stats) => [
    {
        label: "書籍数",
        value: stats.books,
        icon: BookOpen,
        href: "/admin/books",
        color: "text-blue-600 bg-blue-50",
    },
    {
        label: "カテゴリ数",
        value: stats.categories,
        icon: FolderOpen,
        href: null,
        color: "text-green-600 bg-green-50",
    },
    {
        label: "注文数",
        value: stats.orders,
        icon: ShoppingCart,
        href: null,
        color: "text-orange-600 bg-orange-50",
    },
];

export default function Dashboard({ stats }: Props) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-xl font-semibold">ダッシュボード</h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {statCards(stats).map(
                        ({ label, value, icon: Icon, href, color }) => {
                            const card = (
                                <div className="bg-white border rounded-lg p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
                                    <div className={`p-3 rounded-lg ${color}`}>
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {value}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {label}
                                        </p>
                                    </div>
                                </div>
                            );
                            return href ? (
                                <Link key={label} href={href}>
                                    {card}
                                </Link>
                            ) : (
                                <div key={label}>{card}</div>
                            );
                        },
                    )}
                </div>

                <div className="bg-white border rounded-lg p-5">
                    <h2 className="text-sm font-medium text-gray-700 mb-3">
                        クイックリンク
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/books/create"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            + 書籍を登録する
                        </Link>
                        <Link
                            href="/admin/books"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            書籍一覧を見る
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
