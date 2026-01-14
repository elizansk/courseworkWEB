import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.scss";
import {useAuth} from "../../../context/AuthContext.tsx";

export interface TeacherCourse {
    id: number;
    title: string;
    short_desc: string;
    thumbnail_url: string,
    students_count: number;
}

const TeacherProfilePage: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { user } = useAuth();
    console.log(user)
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
                console.log(user?.access)
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
                console.log(data);
                setCourses(data.results);
            } catch {
                setError("Не удалось загрузить курсы");
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const goToCreateCourse = () => {
        navigate("/teacher/create-course");
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
