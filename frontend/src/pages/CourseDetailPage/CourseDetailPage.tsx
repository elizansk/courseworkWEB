import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Course } from "../../types/course.ts";
import "./CourseDetailPage.scss";

const CourseDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`http://127.0.0.1:8000/api/v1/courses/${id}/`)
            .then(res => {
                if (!res.ok) throw new Error("Ошибка при загрузке курса");
                return res.json();
            })
            .then((data) => {
                setCourse(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Загрузка курса...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!course) return <div>Курс не найден</div>;

    const handleBuy = () => {
        alert(`Вы купили курс "${course.title}"`);
    };

    return (
        <div className="course-detail-page">
            <button className="back-button" onClick={() => navigate("/courses")}>
                ← Вернуться к курсам
            </button>
            <div className="course-detail-container">
                {course.thumbnail_url && <img src={course.thumbnail_url} alt={course.title} className="course-image" />}
                <h1 className="course-title">{course.title}</h1>
                <p className="course-meta">
                    <strong>Преподаватель:</strong> {course.instructor.first_name} {course.instructor.last_name} |{" "}
                    <strong>Категория:</strong> {course.category.name}
                </p>
                <p className="course-full-desc">{course.description}</p>
                <p><strong>Длительность:</strong> {course.duration_hours} часов</p>
                <p><strong>Цена:</strong> {course.price} ₽</p>
                <button className="buy-button" onClick={handleBuy}>
                    Купить
                </button>
            </div>
        </div>
    );
};

export default CourseDetailPage;
