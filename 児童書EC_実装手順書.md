# 児童書EC（Laravel + Inertia + React）実装手順書

ポートフォリオ作品③ / 最終更新: 2026/06/22

---

## 0. この作品の位置づけ（ブレないための前提）

- **役割**: ポートフォリオ3作品のうち「デザイン性 × フルスタックの堅実さ」担当
- **物語**: 実在の制作案件「ちえの木の実（https://www.chienokinomi-books.jp/）」（WordPressオリジナルテーマ・自作）の世界観を下敷きに、**架空の絵本店**としてEC機能を実装。「制作（静的サイト）→ 開発（動的EC）への昇格」をREADMEで語る
- **見せたい実力**: 公開/管理の2面構成・ロール権限分離・RESTfulルーティング・多対多/1対多リレーション・画像アップロード・Stripe決済・E2Eテスト
- **やらないと決めたこと**:
  - R3F / 3Dヒーロー（positioningとズレる・沼・締切リスク）
  - 実在の店名/商品/文章/画像の流用（著作権・商標。**架空の店**として作る）
  - AIは盛らない（②と差別化が消えるため）

### トンマナ

- 「ちえの木の実」を参考に: 木のぬくもり・たっぷりの余白・季節感・やさしい配色・上品なタイポgrafi
- 装飾は3Dではなく、上質なイラスト＋繊細なスクロール演出（Framer Motion等）で表現
- 絵本の表紙画像は**AI生成**（架空の絵本の表紙 → 著作権の心配なし・一覧が映える）

---

## 1. 技術スタック

| レイヤー     | 採用                             | 備考                                               |
| ------------ | -------------------------------- | -------------------------------------------------- |
| バックエンド | Laravel                          | 本業スタック。EC/管理画面の主役                    |
| フロント     | React (TypeScript)               | Inertia経由                                        |
| 連携         | Inertia.js                       | APIを挟まずモノリスで一体実装                      |
| 認証足場     | Laravel Breeze (Inertia + React) | ログイン/登録/PW再設定を自動生成。自前実装はしない |
| スタイル     | Tailwind CSS                     | Breezeに同梱                                       |
| 演出         | Framer Motion                    | スクロール/ホバーの繊細な動き（任意）              |
| 決済         | Stripe Checkout（テストモード）  | 単発購入1本に絞る                                  |
| E2E          | Playwright                       | 購入クリティカルパスを1〜2本                       |
| デプロイ     | Laravel Cloud                    | 公式・実質無料・Gitつなぐだけ                      |

### スコープの釘（重要）

- **Stripeはテストモードのカード1回払い（Checkout）だけ**。サブスク/返金/全webhookイベント網羅はやらない
- **Playwrightは全画面網羅しない**。「カート投入→チェックアウト→決済→注文完了」のクリティカルパス1〜2本に集中
- **カートはDB永続化しない**（案1: セッション/state保持）。ログイン跨ぎ保持（carts/cart_itemsテーブル）は工数増のため見送り

---

## 2. データ設計（確定）

### ユーザー系

- `users`（Breeze標準＋role追加）
  - id, name, email, password, **role**（`customer` / `admin`）, timestamps

### 商品系

- `books`
  - id, title, author, publisher, description, price, age_min, age_max, stock, is_published, cover_image_path, timestamps
- `categories`
  - id, name, slug
- `book_category`（多対多 中間テーブル）
  - book_id, category_id

### 注文系

- `orders`
  - id, user_id, status（`pending` / `paid` / `shipped` / `cancelled`）, total_amount, shipping_name, shipping_address, shipping_zip, stripe_session_id, timestamps
- `order_items`
  - id, order_id, book_id, quantity, **unit_price**（※注文時点の価格をスナップショット保存）

### リレーション

- users 1 - 多 orders
- orders 1 - 多 order_items
- order_items 多 - 1 books
- books 多 - 多 categories（book_category経由）

### 設計の見どころ（READMEで触れる）

- `order_items.unit_price` に注文時点の価格を保存 → 後から本体価格を変えても過去注文金額が変わらない（スナップショット）
- usersをroleカラム1つで顧客/管理者を分離 → policy/middlewareで権限制御

---

## 3. 画面一覧（Inertiaページ）

### 公開側（9ページ）

| ルート                       | ページ             | 内容                                                                         |
| ---------------------------- | ------------------ | ---------------------------------------------------------------------------- |
| `GET /`                      | `Home`             | 特集・季節のおすすめ・新着。世界観の顔（重）                                 |
| `GET /books`                 | `Books/Index`      | 一覧。カテゴリ/対象年齢/キーワード絞り込み・並び替え・ページネーション（重） |
| `GET /books/{book}`          | `Books/Show`       | 詳細（画像・あらすじ・対象年齢・価格・在庫・関連本）（重）                   |
| `GET /cart`                  | `Cart/Index`       | カート（数量変更・削除・小計）                                               |
| `GET /checkout`              | `Checkout/Index`   | 配送先入力 → Stripe Checkoutへ（重）                                         |
| `GET /checkout/success`      | `Checkout/Success` | 決済成功・注文完了（軽）                                                     |
| `GET /checkout/cancel`       | `Checkout/Cancel`  | 決済キャンセル（軽）                                                         |
| `GET /mypage/orders`         | `MyPage/Orders`    | 注文履歴（要ログイン）                                                       |
| `GET /mypage/orders/{order}` | `MyPage/OrderShow` | 注文詳細（要ログイン・軽）                                                   |

### 管理側（7ページ・要admin権限 / `auth`+`admin`ミドルウェア）

| ルート                         | ページ                   | 内容                                                 |
| ------------------------------ | ------------------------ | ---------------------------------------------------- |
| `GET /admin`                   | `Admin/Dashboard`        | 売上サマリ・最近の注文・在庫僅少アラート             |
| `GET /admin/books`             | `Admin/Books/Index`      | 一覧（公開/非公開・在庫表示）                        |
| `GET /admin/books/create`      | `Admin/Books/Create`     | 新規登録（画像アップロード＋カテゴリ複数選択）（重） |
| `GET /admin/books/{book}/edit` | `Admin/Books/Edit`       | 編集（重）                                           |
| `GET /admin/categories`        | `Admin/Categories/Index` | カテゴリ管理（一覧＋作成/編集はモーダル）            |
| `GET /admin/orders`            | `Admin/Orders/Index`     | 注文一覧（ステータス絞り込み）                       |
| `GET /admin/orders/{order}`    | `Admin/Orders/Show`      | 注文詳細・ステータス変更                             |

### 認証系（4〜5ページ・Breeze自動生成）

ログイン / 登録 / パスワード忘れ / パスワード再設定 /（メール確認）

### 非ページのエンドポイント

- カート操作: `POST /cart`（追加）, `PATCH /cart/{item}`, `DELETE /cart/{item}` → Inertiaの`router.post`等で叩く
- 決済開始: `POST /checkout`（Stripe Checkoutセッション作成）
- Stripe webhook: `POST /stripe/webhook`（CSRF除外・署名検証 → `orders.status`を`paid`に更新）
- CRUD: `Route::resource('admin/books', ...)`, `Route::resource('admin/categories', ...)`

### ページ数まとめ

- 自作: 公開9 + 管理7 = **16ページ**
- Breeze自動: 認証4〜5ページ
- 重いのは6〜7枚（Home / Books一覧 / Books詳細 / Checkout / 管理Books作成・編集）、残りは軽い

---

## 4. 実装手順（7月スプリント）

### フェーズ0: 環境構築（0.5日）

1. Laravelプロジェクト作成
2. Laravel Breeze（Inertia + React + TypeScript）インストール
3. Gitリポジトリ初期化、`.gitignore`/`.env`確認（**secretsは絶対コミットしない**）
4. DB接続確認（ローカルはSQLite or MySQL）

### フェーズ1: データ基盤（1〜2日）

1. マイグレーション作成（users拡張・books・categories・book_category・orders・order_items）
2. Eloquentモデル＋リレーション定義（hasMany / belongsToMany / belongsTo）
3. Seeder作成（架空の絵本20〜30冊・カテゴリ・admin/customerユーザー）
   - AI生成の表紙画像をstorageに配置、`cover_image_path`に紐付け
4. Factory（テスト・シード用）

### フェーズ2: 権限の土台（0.5日）

1. usersにroleカラム
2. `admin`ミドルウェア作成（role=admin以外を弾く）
3. `/admin`配下にミドルウェア適用

### フェーズ3: 公開側 — 閲覧動線（2〜3日）★MVP核の前半

1. Home（特集・季節のおすすめ・新着）
2. Books/Index（絞り込み・並び替え・ページネーション）
3. Books/Show（詳細・関連本）
   > ここまでで「絵本を探して見る」が完成

### フェーズ4: 公開側 — 購入動線（2〜3日）★MVP核の後半

1. カート（セッション/state保持、追加/数量変更/削除/小計）
2. Checkout入力（配送先フォーム＋バリデーション）
3. Stripe Checkoutセッション作成 → リダイレクト
4. webhookで`orders.status`を`paid`に、在庫を減算
5. success / cancel ページ
6. 注文履歴・注文詳細（マイページ）
   > ここまでで「買える」が完成 = ECとして動く

### フェーズ5: 管理側（2〜3日）★MVP核

1. 商品CRUD（一覧・作成・編集・公開/非公開）= 「店舗スタッフが商品追加したい」機能
   - 画像アップロード（Laravel Storage）
   - カテゴリ複数選択（多対多フォーム）
2. 注文管理（一覧・詳細・ステータス変更）
3. カテゴリ管理
4. ダッシュボード（集計クエリ）※時間を見て厚くする伸びしろ枠

### フェーズ6: テスト（1〜2日）

1. Playwright導入
2. クリティカルパスE2E: カート投入 → チェックアウト → Stripeテスト決済 → 注文完了
3. （余裕があれば）管理の商品登録フロー1本

### フェーズ7: 仕上げ・製品化（2〜3日）

1. デザインの質感底上げ（トンマナ統一・余白・タイポ）
2. 不幸系パス: 空状態 / ローディング / エラー / 在庫切れ表示 / レスポンシブ
3. UIコピーを「本物のプロダクトらしく」
4. TypeScript型の厳格化
5. README（**なぜ作ったか / 設計判断 / 技術選定 / スクショ / デモURL**）
6. Laravel Cloudへデプロイ（Stripeテストキー等は環境変数で）

---

## 5. MVPとして死守する範囲

| 区分 | 必須（死守）                    | 伸びしろ（時間次第）                         |
| ---- | ------------------------------- | -------------------------------------------- |
| 公開 | Home→一覧→詳細→カート→決済→完了 | 関連本ロジック・凝った絞り込みUI             |
| 管理 | 商品CRUD＋注文管理              | ダッシュボードの集計・カテゴリ管理の作り込み |
| 品質 | 購入パスのPlaywright 1本        | テスト本数追加・カバレッジ                   |

---

## 6. README に盛り込む論点（実質の履歴書）

- なぜ作ったか: 制作で納品した絵本店サイトを、EC機能を備えた開発作品として再設計（架空店として）
- なぜInertia（モノリス）を選んだか → アーキテクチャを選択できる人に見える
- スナップショット価格（order_items.unit_price）などの設計判断
- 決済をStripe Checkout＋E2Eで品質担保した点
- スタック選定理由（本業Laravel × モダンなReact/Inertia × 公式ホスティングLaravel Cloud）

---

## 7. 注意・チェックリスト

- [ ] secrets（Stripeキー・DB情報）を絶対コミットしない（`.env` / `.gitignore`）
- [ ] Stripeは**テストモード**で運用（デモ公開時もテストキー）
- [ ] 実在の店名・商品・文章・画像を使わない（架空店として作る）
- [ ] AI生成画像は「架空の絵本の表紙」として使用
- [ ] Laravel CloudはStarterの無料枠運用（アイドル時ハイバネーション）
- [ ] 本業の成長を食いつぶさない範囲で進める
