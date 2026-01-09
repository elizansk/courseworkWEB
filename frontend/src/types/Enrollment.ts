export interface Instructor {
    first_name: string;
    last_name: string;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    short_desc: string;
    thumbnail_url: string | null;
    instructor: Instructor;
}

export interface Enrollment {
    id: number;
    progress_pct: number;
    status: "active" | "completed";
    course: Course;
}
