import React from "react";
import TeacherPanel from "./TeacherPanel";

const AdminPanel: React.FC = () => (
    <div>
        <TeacherPanel />
        <section>
            <h2>Администрирование пользователей</h2>
            <p>Управление студентами и преподавателями, общая статистика.</p>
        </section>
    </div>
);

export default AdminPanel;
