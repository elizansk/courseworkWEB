import type { Course } from "../types/course";
import reactImg from "../assets/react-course.jpg";
import pythonImg from "../assets/python-course.jpg";
import designImg from "../assets/design-course.jpg";

export const getCourses = async (): Promise<Course[]> => {
    return [
        {
            id: "react",
            title: "React + TypeScript: от основ до продакшена",
            author: "Елизавета Якуш",
            image: reactImg,
            level: "Intermediate",
            lengthHours: 18,
            lessons: 42,
            price: 28900,
            description: "Создай реальное приложение на React и TypeScript шаг за шагом.",
            tags: ["React", "TypeScript", "Frontend"],
        },
        {
            id: "python",
            title: "Python для начинающих",
            author: "Никита Поляков",
            image: pythonImg,
            level: "Beginner",
            lengthHours: 10,
            lessons: 25,
            price: 0,
            description: "Изучи основы Python с нуля и создай свой первый проект.",
            tags: ["Python", "Backend"],
        },
        {
            id: "design",
            title: "UI/UX Design: основы проектирования интерфейсов",
            author: "Иван Киселёв",
            image: designImg,
            level: "Beginner",
            lengthHours: 12,
            lessons: 28,
            price: 15000,
            description: "Научись создавать интерфейсы, которыми приятно пользоваться.",
            tags: ["Design", "Figma"],
        },
    ];
};
