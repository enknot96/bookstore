import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Category } from '@/types';
import { ImagePlus, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface BookFormData {
    title: string;
    author: string;
    publisher: string;
    description: string;
    price: string;
    age_min: string;
    age_max: string;
    stock: string;
    is_published: boolean;
    cover_image_path: string;
    cover_image: File | null;
    categories: number[];
    [key: string]: string | boolean | number[] | File | null;
}

interface Props {
    data: BookFormData;
    errors: Partial<Record<string, string>>;
    categories: Category[];
    processing: boolean;
    setData: (key: string, value: string | boolean | number[] | File | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export default function BookForm({
    data,
    errors,
    categories,
    processing,
    setData,
    onSubmit,
    submitLabel,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const toggleCategory = (id: number) => {
        const next = data.categories.includes(id)
            ? data.categories.filter((c) => c !== id)
            : [...data.categories, id];
        setData('categories', next);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('cover_image', file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleRemoveNew = () => {
        setData('cover_image', null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const displayUrl = previewUrl ?? (data.cover_image_path || null);

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* タイトル */}
            <div className="space-y-1">
                <Label htmlFor="title">タイトル *</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                />
                {errors.title && <p className="text-base text-destructive">{errors.title}</p>}
            </div>

            {/* 著者 / 出版社 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="author">著者 *</Label>
                    <Input
                        id="author"
                        value={data.author}
                        onChange={(e) => setData('author', e.target.value)}
                    />
                    {errors.author && <p className="text-base text-destructive">{errors.author}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="publisher">出版社 *</Label>
                    <Input
                        id="publisher"
                        value={data.publisher}
                        onChange={(e) => setData('publisher', e.target.value)}
                    />
                    {errors.publisher && (
                        <p className="text-base text-destructive">{errors.publisher}</p>
                    )}
                </div>
            </div>

            {/* 説明 */}
            <div className="space-y-1">
                <Label htmlFor="description">説明</Label>
                <Textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                {errors.description && (
                    <p className="text-base text-destructive">{errors.description}</p>
                )}
            </div>

            {/* 価格 / 在庫 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="price">価格（円）*</Label>
                    <Input
                        id="price"
                        type="number"
                        min={0}
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                    />
                    {errors.price && <p className="text-base text-destructive">{errors.price}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="stock">在庫数 *</Label>
                    <Input
                        id="stock"
                        type="number"
                        min={0}
                        value={data.stock}
                        onChange={(e) => setData('stock', e.target.value)}
                    />
                    {errors.stock && <p className="text-base text-destructive">{errors.stock}</p>}
                </div>
            </div>

            {/* 対象年齢 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="age_min">対象年齢（下限）</Label>
                    <Input
                        id="age_min"
                        type="number"
                        min={0}
                        max={99}
                        value={data.age_min}
                        onChange={(e) => setData('age_min', e.target.value)}
                    />
                    {errors.age_min && <p className="text-base text-destructive">{errors.age_min}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="age_max">対象年齢（上限）</Label>
                    <Input
                        id="age_max"
                        type="number"
                        min={0}
                        max={99}
                        value={data.age_max}
                        onChange={(e) => setData('age_max', e.target.value)}
                    />
                    {errors.age_max && <p className="text-base text-destructive">{errors.age_max}</p>}
                </div>
            </div>

            {/* カバー画像アップロード */}
            <div className="space-y-2">
                <Label>カバー画像</Label>
                <div className="flex gap-4 items-start">
                    {/* プレビュー */}
                    {displayUrl ? (
                        <div className="relative w-28 h-36 flex-shrink-0">
                            <img
                                src={displayUrl}
                                alt="カバープレビュー"
                                className="w-full h-full object-cover rounded-md border"
                            />
                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={handleRemoveNew}
                                    className="absolute -top-2 -right-2 bg-white border rounded-full p-0.5 shadow hover:bg-gray-100"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="w-28 h-36 flex-shrink-0 bg-gray-100 rounded-md border border-dashed flex items-center justify-center text-gray-400">
                            <ImagePlus size={24} />
                        </div>
                    )}

                    {/* アップロードボタン */}
                    <div className="flex flex-col gap-2 justify-center pt-1">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {displayUrl ? '画像を変更' : '画像を選択'}
                        </Button>
                        <p className="text-sm text-gray-400">JPEG / PNG / WebP（5MB以内）</p>
                        {data.cover_image && (
                            <p className="text-sm text-green-600 font-medium">
                                {data.cover_image.name}
                            </p>
                        )}
                    </div>
                </div>
                {errors.cover_image && (
                    <p className="text-base text-destructive">{errors.cover_image}</p>
                )}
            </div>

            {/* カテゴリ */}
            <div className="space-y-2">
                <Label>カテゴリ</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={data.categories.includes(cat.id)}
                                onCheckedChange={() => toggleCategory(cat.id)}
                            />
                            <span className="text-base">{cat.name}</span>
                        </label>
                    ))}
                </div>
                {errors.categories && (
                    <p className="text-base text-destructive">{errors.categories}</p>
                )}
            </div>

            {/* 公開フラグ */}
            <div className="flex items-center gap-2">
                <Checkbox
                    id="is_published"
                    checked={data.is_published}
                    onCheckedChange={(v) => setData('is_published', Boolean(v))}
                />
                <Label htmlFor="is_published">公開する</Label>
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={processing}>
                    {processing ? '保存中...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
