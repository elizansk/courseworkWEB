export interface Instructor {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar_url: string | null;
    is_active: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    parent: number | null;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_desc: string;
    instructor: Instructor;
    category: Category;
    price: string;
    thumbnail_url: string | undefined;
    duration_hours: number;
    modules: any[];
    average_rating: number | null;
    ratings: any[];
    progress_pct: number;
}
