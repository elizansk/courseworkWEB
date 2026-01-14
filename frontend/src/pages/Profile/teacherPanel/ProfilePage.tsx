import React, { useState } from "react";
import "./ProfilePage.scss";
import StudentCoursePanel from "../../../components/studentCoursePanel/StudentCoursePanel";
import { useAuth } from "../../../context/AuthContext";

type Role = "student" | "teacher" | "admin";

interface ProfilePageProps {
    userRole: Role;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userRole }) => {
    const [activeTab, setActiveTab] = useState<string>("profile");
    const { user } = useAuth();

    const userInfo = {
        name: `${user?.first_name} ${user?.last_name}`,
        avatar: user?.avatar_url || "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-600nw-2345549599.jpg",
    };

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return (
                    <div className="tab-content fade">
                        <div className="profile-header">
                            <img src={userInfo.avatar} alt={userInfo.name} className="avatar" />
                            <div className="profile-info">
                                <h1>{userInfo.name}</h1>
                                <p>Роль: {userRole}</p>
                            </div>
                        </div>
                    </div>
                );

            case "my-courses":
                return <StudentCoursePanel />;


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

                </ul>
            </aside>

            <main className="profile-content">{renderContent()}</main>
        </div>
    );
};

export default ProfilePage;
