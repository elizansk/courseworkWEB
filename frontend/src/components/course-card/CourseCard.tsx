import React from "react";
import "./CourseCard.scss";
import type { Course } from "../../types/course.ts";
import { Link, useNavigate } from "react-router-dom";

interface CourseCardProps {
    course: Course;
    onBuy?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onBuy }) => {
    const navigate = useNavigate();

    const handleBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (onBuy) onBuy(course);
        else {
            console.log(`/payment/${course.id}`)
            navigate(`/payment/${course.id}`, { state: { course } });

        }
    };

    return (
        <Link to={`/course/${course.slug}`} className="course-card">
            <div className="course-info">
                <img src={course.thumbnail_url} alt={course.title} />
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.short_desc}</p>
                <button className="buy-button" onClick={handleBuy}>
                    Купить
                </button>
            </div>
        </Link>
    );
};

export default CourseCard;
