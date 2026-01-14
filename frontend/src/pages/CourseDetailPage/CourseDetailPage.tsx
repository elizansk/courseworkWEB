import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Course } from "../../types/course.ts";
import "./CourseDetailPage.scss";

type Review = {
    id: number;
    user: {
        first_name: string;
        last_name: string;
    };
    rating: number;
    comment: string;
    created_at: string;
};

const CourseDetailPage: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { slug } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        if (!slug) return;

        fetch(`${API_URL}/courses/${slug}/`)
            .then((res) => {
                if (!res.ok) throw new Error("Ошибка при загрузке курса");
                return res.json();
            })
            .then((data) => {
                setCourse(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);

    const handleBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!course) return;
        navigate(`/payment/${course.id}`, { state: { course } });
    };

    const openReviews = async () => {
        if (!course) return;
        try {
            const res = await fetch(`${API_URL}/courses/${course.id}/ratings/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            });
            const data = await res.json();
            setReviews(data.results);
            setShowReviewsModal(true);
        } catch (e) {
            console.error("Ошибка загрузки отзывов", e);
        }
    };

    if (loading) return <div>Загрузка курса...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!course) return <div>Курс не найден</div>;

    return (
        <div className="course-detail-page">
            <button className="back-button" onClick={() => navigate("/courses")}>
                ← Вернуться к курсам
            </button>

            <div className="course-detail-container">
                {course.thumbnail_url && (
                    <img src={course.thumbnail_url} alt={course.title} className="course-image" />
                )}
                <h1 className="course-title">{course.title}</h1>
                <p className="course-meta">
                    <strong>Преподаватель:</strong> {course.instructor.first_name} {course.instructor.last_name} |{" "}
                    <strong>Категория:</strong> {course.category.name}
                </p>
                <p className="course-full-desc">{course.description}</p>
                <p><strong>Длительность:</strong> {course.duration_hours} часов</p>
                <p><strong>Цена:</strong> {course.price} ₽</p>

                <div className="action-buttons">
                    <button className="buy-button" onClick={handleBuy}>
                        Купить
                    </button>
                    <button className="view-reviews-btn" onClick={openReviews}>
                        Посмотреть отзывы
                    </button>
                </div>
            </div>

            {showReviewsModal && (
                <div className="review-modal-overlay" onClick={() => setShowReviewsModal(false)}>
                    <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowReviewsModal(false)}>
                            &times;
                        </button>
                        <h2>Отзывы о курсе</h2>
                        {reviews.length === 0 && <p>Пока нет отзывов</p>}
                        {reviews.map((r) => (
                            <div key={r.id} className="review-card">
                                <div className="review-header">
                                    <strong>
                                        {r.user.first_name} {r.user.last_name}
                                    </strong>
                                    <span>
                    {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                  </span>
                                </div>
                                <p>{r.comment}</p>
                                <small>{new Date(r.created_at).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetailPage;
