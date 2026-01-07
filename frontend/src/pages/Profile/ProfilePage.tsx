import React, { useState } from "react";
import "./profile.scss";
import StudentCoursePanel from "../../components/studentCoursePanel/StudentCoursePanel";
import { useAuth } from "../../context/AuthContext";

type Role = "student" | "teacher" | "admin";

interface ProfilePageProps {
    userRole: Role;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userRole }) => {
    const [activeTab, setActiveTab] = useState<string>("profile");
    const { user } = useAuth();

    const userInfo = {
        name: `${user?.first_name} ${user?.last_name}`,
        avatar: "https://i.pravatar.cc/150?img=32",
    };

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
                            <img src={userInfo.avatar} alt={userInfo.name} className="avatar" />
                            <div>
                                <h1>{userInfo.name}</h1>
                                <p>Роль: {userRole}</p>
                            </div>
                        </div>
                    </div>
                );

            case "my-courses":
                return <StudentCoursePanel />;

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
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.name}</td>
                                        <td>{u.role}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
                return null;

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
                </ul>
            </aside>

            <main className="profile-content">{renderContent()}</main>
        </div>
    );
};

export default ProfilePage;
