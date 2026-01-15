import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./ProfilePage.scss";
import {useAuth} from "../../../context/AuthContext.tsx";

export interface TeacherCourse {
    id: number;
    title: string;
    short_desc: string;
    thumbnail_url: string,
}

const TeacherProfilePage: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const {user} = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] =
        useState<"profile" | "courses" | "submissions">("courses");

    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ===== ЗАГРУЗКА КУРСОВ =====
    useEffect(() => {
        const loadCourses = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `${API_URL}/instructor/my-courses/`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.access}`,
                            Accept: "application/json",
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Ошибка загрузки курсов");
                }

                const data = await response.json();
                setCourses(data.results);
            } catch {
                setError("Не удалось загрузить курсы");
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const deleteCourse = async (id: number) => {
        if (!window.confirm("Удалить курс?")) return;

        try {
            const token = user?.access;

            await fetch(`${API_URL}/instructor/courses/${id}/delete/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCourses(prev => prev.filter(c => c.id !== id));
        } catch {
            alert("Ошибка удаления курса");
        }
    };

    const goToCreateCourse = () => {
        navigate("/teacher/create-course");
    };

    const editCourse = (course: TeacherCourse) => {
        navigate("/teacher/create-course", {state: {course}});
    };


    // ===== UI =====
    return (
        <div className="profile-page">
            <aside className="profile-sidebar">
                <h2>Преподаватель</h2>
                <ul>
                    <li
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => setActiveTab("profile")}
                    >
                        Профиль
                    </li>
                    <li
                        className={activeTab === "courses" ? "active" : ""}
                        onClick={() => setActiveTab("courses")}
                    >
                        Мои курсы
                    </li>
                    <li
                        className={activeTab === "submissions" ? "active" : ""}
                        onClick={() => navigate("/teacher/submissions")}
                    >
                        Проверка ДЗ
                    </li>
                </ul>
            </aside>

            <main className="profile-content">
                <div className="tab-content">
                    {activeTab === "profile" && (
                        <>
                            <h1>{user?.first_name} {user?.last_name} </h1>
                            <p>Преподаватель</p>
                        </>
                    )}

                    {activeTab === "courses" && (
                        <>
                            <h2>Мои курсы</h2>
                            <button
                                className="add-course-btn"
                                onClick={goToCreateCourse}
                            >
                                Добавить новый курс
                            </button>

                            {loading && <p>Загрузка...</p>}
                            {error && <p className="error">{error}</p>}

                            <div className="course-list">
                                {courses.map(course => (
                                    <div key={course.id} className="course-card">
                                        <img src={course.thumbnail_url}/>
                                        <h3>{course.title}</h3>
                                        <p>{course.short_desc}</p>
                                        <div className="actions">
                                            <button className="edit" onClick={() => editCourse(course)}>
                                                Редактировать
                                            </button>

                                            <button
                                                className="delete"
                                                onClick={() =>
                                                    deleteCourse(course.id)
                                                }
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeacherProfilePage;
