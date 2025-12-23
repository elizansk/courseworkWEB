export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
    id: string;
    title: string;
    author: string;
    image: string;
    level: Level;
    lengthHours: number;
    lessons: number;
    price: number;
    description: string;
    tags: string[];
}
