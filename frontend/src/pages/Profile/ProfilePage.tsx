import React, { useState } from "react";
import "./profile.scss";

type Role = "student" | "teacher" | "admin";

interface ProfilePageProps {
    userRole: Role;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userRole }) => {
    const [activeTab, setActiveTab] = useState<string>("profile");

    const user = {
        name: "Иван Петров",
        avatar: "https://i.pravatar.cc/150?img=32", // случайная картинка
    };

    const courses = [
        { id: 1, title: "Микросервисная архитектура", progress: 75 },
        { id: 2, title: "Python для анализа данных", progress: 40 },
        { id: 3, title: "React и Frontend-разработка", progress: 90 }
    ];

    const users = [
        { id: 1, name: "Иван Петров", role: "student" },
        { id: 2, name: "Мария Кузнецова", role: "teacher" },
        { id: 3, name: "Дмитрий Иванов", role: "student" },
        { id: 4, name: "Наталья Сергеева", role: "teacher" }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="tab-content fade">
                        <div className="profile-header">
                            <img src={user.avatar} alt={user.name} className="avatar" />
                            <div>
                                <h1>{user.name}</h1>
                                <p>Роль: {userRole}</p>
                            </div>
                        </div>
                        <p>Здесь отображается информация о вашем профиле.</p>
                    </div>
                );
            case "my-courses":
                return (
                    <div className="tab-content fade">
                        <h2>Мои курсы</h2>
                        <div className="course-list">
                            {courses.map((course) => (
                                <div key={course.id} className="course-card">
                                    <h3>{course.title}</h3>
                                    <div className="progress-bar">
                                        <div
                                            className="progress"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                    <span>{course.progress}% пройдено</span>
                                    <div className="actions">
                                        <button className="continue">Продолжить</button>
                                        {(userRole === "teacher" || userRole === "admin") && (
                                            <button className="delete">Удалить</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "manage-courses":
                if (userRole === "teacher" || userRole === "admin") {
                    return (
                        <div className="tab-content fade">
                            <h2>Управление курсами</h2>
                            <p>Добавляйте, редактируйте и отслеживайте курсы.</p>
                        </div>
                    );
                }
                return null;
            case "manage-users":
                if (userRole === "admin") {
                    return (
                        <div className="tab-content fade">
                            <h2>Управление пользователями</h2>
                            <table className="users-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Имя</th>
                                    <th>Роль</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
                return null;
            case "settings":
                return (
                    <div className="tab-content fade">
                        <h2>Настройки</h2>
                        <p>Изменение пароля, настройки уведомлений и прочее.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="profile-page">
            <aside className="profile-sidebar">
                <h2>Личный кабинет</h2>
                <ul>
                    <li
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => setActiveTab("profile")}
                    >
                        Профиль
                    </li>
                    <li
                        className={activeTab === "my-courses" ? "active" : ""}
                        onClick={() => setActiveTab("my-courses")}
                    >
                        Мои курсы
                    </li>
                    {(userRole === "teacher" || userRole === "admin") && (
                        <li
                            className={activeTab === "manage-courses" ? "active" : ""}
                            onClick={() => setActiveTab("manage-courses")}
                        >
                            Управление курсами
                        </li>
                    )}
                    {userRole === "admin" && (
                        <li
                            className={activeTab === "manage-users" ? "active" : ""}
                            onClick={() => setActiveTab("manage-users")}
                        >
                            Управление пользователями
                        </li>
                    )}
                    <li
                        className={activeTab === "settings" ? "active" : ""}
                        onClick={() => setActiveTab("settings")}
                    >
                        Настройки
                    </li>
                </ul>
            </aside>

            <main className="profile-content">{renderContent()}</main>
        </div>
    );
};

export default ProfilePage;
