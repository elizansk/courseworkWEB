import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CourseReviewPage.scss";

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
};

type Rating = {
    id: number;
    user: User;
    rating: number;
    comment: string;
    created_at: string;
};

const CourseReviewPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const API_URL = import.meta.env.VITE_API_URL;

    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loading, setLoading] = useState(true);
    const [ratingValue, setRatingValue] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchRatings = async () => {
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}/ratings/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            });
            const data = await res.json();
            setRatings(data.results);
        } catch (err) {
            console.error("Ошибка загрузки отзывов:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ratingValue === 0) {
            alert("Поставьте рейтинг!");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}/ratings/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
                body: JSON.stringify({
                    rating: ratingValue,
                    comment,
                }),
            });

            if (!res.ok) throw new Error("Ошибка при отправке отзыва");
            const newRating = await res.json();

            setRatings(prev => [newRating, ...prev]);
            setRatingValue(0);
            setComment("");
            alert("Отзыв успешно добавлен!");
        } catch (err) {
            console.error(err);
            alert("Не удалось добавить отзыв");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p>Загрузка отзывов...</p>;

    return (
        <div className="course-review-page">
            <h1>Оставить отзыв</h1>

            <form onSubmit={handleSubmit} className="review-form">
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map(num => (
                        <span
                            key={num}
                            className={num <= ratingValue ? "active" : ""}
                            onClick={() => setRatingValue(num)}
                        >
              ★
            </span>
                    ))}
                </div>

                <textarea
                    placeholder="Напишите ваш отзыв"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? "Отправляем..." : "Отправить отзыв"}
                </button>
            </form>

            <div className="ratings-list">
                <h2>Отзывы студентов</h2>
                {ratings.length === 0 && <p>Пока нет отзывов</p>}
                {ratings.map(r => (
                    <div key={r.id} className="rating-card">
                        <div className="user-info">
                            <span className="user-name">{r.user.first_name} {r.user.last_name}</span>
                            <span className="rating-stars">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </span>
                        </div>
                        <p className="comment">{r.comment}</p>
                        <span className="created-at">{new Date(r.created_at).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseReviewPage;
