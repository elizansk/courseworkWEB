import React from "react";
import StudentPanel from "./StudentPanel";

const TeacherPanel: React.FC = () => (
    <div>
        <StudentPanel />
        <section>
            <h2>Управление моими курсами</h2>
            <p>Здесь вы можете добавлять, редактировать и отслеживать студентов своих курсов.</p>
        </section>
    </div>
);

export default TeacherPanel;
