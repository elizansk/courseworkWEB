import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentCoursePanel.scss"
const StudentCoursePanel: React.FC = () => {
    const navigate = useNavigate();

    const courses = [
        { id: 1, title: "Микросервисная1 архитектура", progress: 75, slug: "microservices" },
        { id: 2, title: "Python для анализа данных", progress: 40, slug: "python-data" },
        { id: 3, title: "React и Frontend-разработка", progress: 90, slug: "react-frontend" }
    ];

    const goToLessons = (slug: string) => {
        navigate(`/course/${slug}/lessons`);
    };

    return (
        <div className="student-panel">
            <section className="profile-info">
                <h1>Добро пожаловать, Иван!</h1>
                <p>Студент IT Academy</p>
            </section>

            <section className="my-courses">
                <h2>Мои курсы</h2>
                <div className="course-list">
                    {courses.map((course) => (
                        <div key={course.id} className="course-card">
                            <h3>{course.title}</h3>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <span>{course.progress}% пройдено</span>

                            <button
                                className="continue-btn"
                                onClick={() => goToLessons(course.slug)}
                            >
                                Продолжить
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentCoursePanel;
