import React from "react";
import StudentCoursePanel from "../../components/studentCoursePanel/StudentCoursePanel.tsx";


const TeacherPanel: React.FC = () => (
    <div>
        <StudentCoursePanel />
        <section>
            <h2>Управление моими курсами</h2>
            <p>Здесь вы можете добавлять, редактировать и отслеживать студентов своих курсов.</p>
        </section>
    </div>
);

export default TeacherPanel;
