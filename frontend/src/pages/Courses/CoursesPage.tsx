import React, { useEffect, useState } from "react";
import "./CoursesPage.scss";
import CourseCard from "../../components/course-card/CourseCard";
import type { Course } from "../../types/course";

const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/v1/courses/")
            .then(res => {
                if (!res.ok) throw new Error("Ошибка при загрузке курсов");
                return res.json();
            })
            .then((data) => {
                setCourses(data.results);   // results — как и раньше
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Загрузка курсов...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="courses-page">
            <h1>Все курсы</h1>
            <div className="courses-grid">
                {courses.slice(0, 9).map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CoursesPage;
