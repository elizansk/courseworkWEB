import React from "react";

interface SidebarProps {
    role: "student" | "teacher" | "admin";
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    return (
        <aside className="profile-sidebar">
            <h2>Личный кабинет</h2>
            <ul>
                <li>Профиль</li>
                <li>Мои курсы</li>
                {role !== "student" && <li>Управление курсами</li>}
                {role === "admin" && <li>Управление пользователями</li>}
                <li>Настройки</li>
            </ul>
        </aside>
    );
};

export default Sidebar;
