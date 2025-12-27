import React from "react";

const StudentPanel: React.FC = () => {
    const courses = [
        { id: 1, title: "Микросервисная архитектура", progress: 75 },
        { id: 2, title: "Python для анализа данных", progress: 40 },
        { id: 3, title: "React и Frontend-разработка", progress: 90 }
    ];

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
                                <div
                                    className="progress"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                            <span>{course.progress}% пройдено</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentPanel;
