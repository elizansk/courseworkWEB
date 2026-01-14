export type UserShort = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar_url: string | null;
    is_active: boolean;
};

export type SubmissionForTeacher = {
    id: number;
    user: UserShort;
    course_id: number;
    course_title: string;
    lesson_id: number;
    lesson_title: string;
    assignment_title: string;
    content: string;
    file_url: string;
    submitted_at: string;
    is_graded: boolean;
    score: number | null;
    feedback: string | null;
};

export type SubmissionsListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: SubmissionForTeacher[];
};

export type TeacherCourse = {
    id: number;
    title: string;
    description: string;
    students_count: number;
    is_published: boolean;
};