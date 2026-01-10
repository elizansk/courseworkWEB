export type Submission = {
    id: number;
    user: number;
    content: string;
    file_url: string | null;
    score: number | null;
    feedback: string | null;
    is_graded: boolean;
};

export type Assignment = {
    id: number;
    title: string;
    description: string;
    submissions: Submission[];
};

export type Lesson = {
    id: number;
    title: string;
    order_num: number;
    video_url: string;
    duration_min: number;
    is_locked: boolean;
    assignments: Assignment[];
};

export type Module = {
    id: number;
    title: string;
    description: string;
    order_num: number;
    lessons: Lesson[];
};

export type CourseResponse = {
    progress_pct: number;
    total_assignments: number;
    completed_assignments: number;
    modules: Module[];
};
