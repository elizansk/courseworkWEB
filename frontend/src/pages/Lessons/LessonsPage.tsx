import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./LessonsPage.scss";

type Lesson = {
    id: number;
    title: string;
    videoUrl: string;
    description: string;
    homework: string;
};

type Course = {
    id: number;
    slug: string;
    name: string;
    lessons: Lesson[];
};

// 🔹 Фейковые данные всех курсов
const courses: Course[] = [
    {
        id: 1,
        slug: "microservices",
        name: "Микросервисная архитектура",
        lessons: [
            {
                id: 1,
                title: "Введение в микросервисы",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                description: "Основы микросервисной архитектуры.",
                homework: "Сделать схему микросервиса"
            },
            {
                id: 2,
                title: "Архитектурные паттерны",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                description: "Основные паттерны микросервисов.",
                homework: "Определить подходящий паттерн для проекта"
            }
        ]
    },
    {
        id: 2,
        slug: "python-data",
        name: "Python для анализа данных",
        lessons: [
            {
                id: 1,
                title: "Основы Python",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                description: "Введение в Python.",
                homework: "Написать простую программу на Python"
            },
            {
                id: 2,
                title: "Работа с библиотеками Pandas и NumPy",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                description: "Основы анализа данных с помощью Pandas и NumPy.",
                homework: "Обработать небольшой датасет"
            }
        ]
    },
    {
        id: 3,
        slug: "react-frontend",
        name: "React и Frontend-разработка",
        lessons: [
            {
                id: 1,
                title: "Введение в React",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                description: "Основы React и компонентов.",
                homework: "Создать первый компонент React"
            },
            {
                id: 2,
                title: "Работа с состоянием и пропсами",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                description: "Понимание useState и props.",
                homework: "Сделать счетчик с кнопками"
            }
        ]
    }
];

const LessonsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const course = courses.find(c => c.slug === slug);

    const [completedLessons, setCompletedLessons] = useState<number[]>([]);

    const toggleCompleted = (lessonId: number) => {
        setCompletedLessons(prev =>
            prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    if (!course) return <p>Курс не найден</p>;

    return (
        <div className="lessons">
            <h1>Уроки курса "{course.name}"</h1>

            <div className="lessons-list">
                {course.lessons.map(lesson => {
                    const isCompleted = completedLessons.includes(lesson.id);

                    return (
                        <div className="lesson-card" key={lesson.id}>
                            <h2>{lesson.title}</h2>
                            <div className="video-wrapper">
                                <iframe
                                    src={lesson.videoUrl}
                                    title={lesson.title}
                                    allowFullScreen
                                />
                            </div>
                            <p className="description">{lesson.description}</p>
                            <div className="homework">
                                <h3>Домашнее задание</h3>
                                <p>{lesson.homework}</p>
                            </div>
                            <button
                                className={`complete-btn ${isCompleted ? "done" : ""}`}
                                onClick={() => toggleCompleted(lesson.id)}
                            >
                                {isCompleted ? "✅ Выполнено" : "Отметить как выполнено"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LessonsPage;
