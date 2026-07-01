export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    description: string | null;
    price: number;
    age_min: number | null;
    age_max: number | null;
    stock: number;
    is_published: boolean;
    cover_image_path: string | null;
    categories: Category[];
    created_at: string;
    updated_at: string;
}

export interface PaginatedBooks {
    data: Book[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
