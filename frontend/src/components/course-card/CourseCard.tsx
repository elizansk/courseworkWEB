import React from "react";
import "./CourseCard.scss";
import type { Course } from "../../types/course.ts";
import { Link } from "react-router-dom";

interface CourseCardProps {
    course: Course;
    onBuy?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onBuy }) => {
    const handleBuy = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onBuy) onBuy(course);
        else alert(`Вы купили курс "${course.title}"`);
    };

    return (
        <Link to={`/course/${course.id}`} className="course-card">
            <div className="course-info">
                <img src={course.thumbnail_url || "../assets/react-course.png"} alt={course.title} />
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course. short_desc}</p>
                <button className="buy-button" onClick={handleBuy}>
                    Купить
                </button>
            </div>
        </Link>
    );
};

export default CourseCard;
