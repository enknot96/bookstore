# 児童書EC（こもれび書房）

架空の絵本専門店を舞台にしたECサイトです。Laravel + Inertia.js + React（TypeScript）によるモノリス構成で、公開側の購入導線と管理側の運用機能を一通り実装しています。

- **公開URL**: https://bookstore-igf1.onrender.com/
- **管理画面**: https://bookstore-igf1.onrender.com/admin

### デモ用アカウント

| 権限         | メールアドレス         | パスワード |
| ------------ | ---------------------- | ---------- |
| 管理者       | `admin@example.com`    | `password` |
| 一般ユーザー | `customer@example.com` | `password` |

> ポートフォリオ公開用のデモアカウントです。決済はStripeのテストモードのみで動作します。

---

## なぜ作ったか

実案件で制作した絵本店の静的サイトの世界観を下敷きに、「制作（静的サイト）→開発（動的EC）」への発展を見せることを目的としたポートフォリオ作品です。実在の店舗・商品・画像は使用せず、架空の絵本店として設計しています。

## 技術スタック

| レイヤー           | 採用技術                         |
| ------------------ | -------------------------------- |
| バックエンド       | Laravel 13 (PHP 8.4)             |
| フロントエンド     | React (TypeScript) + Inertia.js  |
| スタイリング       | Tailwind CSS                     |
| 認証               | Laravel Breeze (Inertia + React) |
| 決済               | Stripe Checkout（テストモード）  |
| ファイルストレージ | Cloudflare R2（書籍カバー画像）  |
| データベース       | PostgreSQL（Supabase）           |
| デプロイ           | Render（Docker）                 |

## 主な機能

### 公開側

- トップページ（新着・カテゴリ導線）
- 書籍一覧・詳細（カテゴリ・対象年齢での絞り込み）
- カート（数量変更・削除）
- Stripe Checkoutによる決済〜注文確定
- 注文履歴・注文詳細（マイページ）

### 管理側（`role: admin`のみアクセス可）

- 商品CRUD（画像アップロード・カテゴリ複数選択・公開/非公開切り替え）
- 商品のゴミ箱機能（論理削除・復元・一括操作）
- 注文管理（一覧・詳細・ステータス変更）
- 顧客一覧
- 管理者アカウント管理
- サイト設定

## 設計上のポイント

- **注文金額のスナップショット化**: `order_items.unit_price`に注文時点の単価を保存し、後から商品価格を変更しても過去の注文金額に影響しない設計にしています（`app/Models/OrderItem.php`）。
- **ロールベースの権限分離**: `users.role`（`admin` / `customer`）と専用ミドルウェアのみで管理画面への権限制御を実現し、複雑な権限テーブルを持たずシンプルに保っています。
- **論理削除によるゴミ箱機能**: 商品削除は`SoftDeletes`による論理削除とし、誤削除からの復元や一括操作に対応しています（`app/Models/Book.php`）。
- **Stripe Webhookによる決済確定**: 決済の確定処理はクライアントのリダイレクトに依存せず、Webhook（署名検証つき）で`orders.status`を更新する構成にしています。

## デプロイ構成（Render）

Docker（PHP 8.4 + Apache）でビルドし、Renderにデプロイしています。データベースはSupabase（PostgreSQL）、画像ストレージはCloudflare R2を使用し、いずれもRenderの環境変数で接続情報を管理しています。

## ローカル開発

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate
php artisan db:seed

npm run dev
```

別ターミナルでLaravel開発サーバーを起動してください。

```bash
php artisan serve
```
