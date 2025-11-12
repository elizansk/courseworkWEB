import { useEffect, useState } from "react";
import { getCourses } from "../../api/courses";
import type { Course } from "../../types/course";
import CourseCard from "../ui/CourseCard";
import "../../styles/components/courses.scss";

const CoursesSection: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        getCourses().then(setCourses);
    }, []);

    return (
        <section className="courses">
            <h2>Популярные курсы</h2>
            <div className="course-grid">
                {courses.map((c) => (
                    <CourseCard key={c.id} course={c} />
                ))}
            </div>
        </section>
    );
};

export default CoursesSection;
