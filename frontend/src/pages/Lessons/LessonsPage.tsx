import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LessonsPage.scss";
import HomeworkCard from "../../components/homeworkCard/HomeworkCard";
import type { CourseResponse, Submission } from "../../types/CourseResponse";

const LessonsPage: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { courseId } = useParams<{ courseId: string }>();

    const [course, setCourse] = useState<CourseResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/courses/${courseId}/modules/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access")}`,
                        },
                    }
                );

                const data = await res.json();
                console.log(data);
                setCourse(data);
                setActiveModuleId(data.modules[0]?.id ?? null);
            } catch (e) {
                console.error("Ошибка загрузки курса", e);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const updateSubmission = (assignmentId: number, submission: Submission) => {
        setCourse(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                modules: prev.modules.map(m => ({
                    ...m,
                    lessons: m.lessons.map(l => ({
                        ...l,
                        assignments: l.assignments.map(a =>
                            a.id === assignmentId
                                ? { ...a, submissions: [submission] }
                                : a
                        ),
                    })),
                })),
            };
        });
    };

    if (loading) return <p>Загрузка...</p>;
    if (!course) return <p>Курс не найден</p>;

    const activeModule = course.modules.find(
        m => m.id === activeModuleId
    );

    return (
        <div className="lessons">
            <h1>Программа курса</h1>

            <div className="course-progress">
                Прогресс: {course.completed_assignments} /{" "}
                {course.total_assignments} заданий
            </div>

            <div className="module-tabs">
                {course.modules.map(module => (
                    <button
                        key={module.id}
                        className={module.id === activeModuleId ? "active" : ""}
                        onClick={() => setActiveModuleId(module.id)}
                    >
                        {module.order_num}. {module.title}
                    </button>
                ))}
            </div>

            {activeModule && (
                <div className="module">
                    <h2>
                        {activeModule.order_num}. {activeModule.title}
                    </h2>

                    <p className="module-description">
                        {activeModule.description}
                    </p>

                    {activeModule.lessons.map(lesson => (
                        <div key={lesson.id} className="lesson-card">
                            <h3>
                                {lesson.order_num}. {lesson.title}
                            </h3>

                            <div className="video-wrapper">
                                {lesson.video_url ? (
                                    <iframe
                                        src={lesson.video_url}
                                        title={lesson.title}
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="video-placeholder">
                                        Видео к этому уроку пока не добавлено
                                    </div>
                                )}
                            </div>

                            {lesson.assignments.map(assignment => (
                                <HomeworkCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    onSubmitted={s =>
                                        updateSubmission(assignment.id, s)
                                    }
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LessonsPage;
