import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentCoursePanel.scss";
import type { Enrollment } from "../../types/Enrollment.ts";
import {useAuth} from "../../context/AuthContext.tsx";

const StudentCoursePanel: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/profile/enrollments/`,
                    {
                        headers: {
                            "Authorization": `Bearer ${user?.access}`,
                            "Accept": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Не удалось загрузить курсы");
                }

                const data = await response.json();
                console.log(data.results)
                setEnrollments(data.results);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    const goToLessons = (CourseId: string) => {
        console.log(`profile/course/${CourseId}/lessons`)
        navigate(`/profile/course/${CourseId}/lessons`);
    };

    if (loading) {
        return <div className="student-panel">Загрузка курсов...</div>;
    }

    if (error) {
        return <div className="student-panel error">{error}</div>;
    }

    return (
        <div className="student-panel">
            <section className="my-courses">
                <h2>Мои курсы</h2>

                {enrollments.length === 0 ? (
                    <p>У вас пока нет активных курсов</p>
                ) : (
                    <div className="course-list">
                        {enrollments.map((enrollment) => {
                            const { course, progress_pct } = enrollment;

                            return (
                                <div key={enrollment.id} className="course-card">
                                    {course.thumbnail_url && (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.title}
                                            className="course-thumb"
                                        />
                                    )}

                                    <h3>{course.title}</h3>
                                    <p className="course-desc">{course.short_desc}</p>

                                    <p className="course-instructor">
                                        Преподаватель:{" "}
                                        {course.instructor.first_name}{" "}
                                        {course.instructor.last_name}
                                    </p>

                                    <div className="progress-bar">
                                        <div
                                            className="progress"
                                            style={{ width: `${progress_pct}%` }}
                                        />
                                    </div>

                                    <span>{progress_pct}% пройдено</span>

                                    <button
                                        className="continue-btn"
                                        onClick={() => goToLessons(course.id.toString())}
                                    >
                                        Продолжить
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default StudentCoursePanel;
