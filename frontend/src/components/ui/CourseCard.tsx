import React from "react";
import type { Course } from "../../types/course";
import "../../styles/components/courses.scss";

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    return (
        <div className="course-card">
            <img src={course.image} alt={course.title} />
            <div className="content">
                <h3>{course.title}</h3>
                <p className="author">{course.author}</p>
                <p className="desc">{course.description}</p>
                <div className="footer">
                    <span className="price">{course.price} ₽</span>
                    <button>Записаться</button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
