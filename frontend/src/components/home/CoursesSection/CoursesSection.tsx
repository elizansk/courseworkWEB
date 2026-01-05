import React from "react";
import { useNavigate } from "react-router-dom";
import "./CoursesSection.scss";

const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Добро пожаловать в нашу академию!</h1>
                <p>Обучаем специалистов будущего в IT, Data Science, DevOps и Frontend-разработке.</p>
                <button className="btn" onClick={() => navigate("/courses")}>
                    Смотреть все курсы
                </button>
            </div>
        </section>
    );
};

export default Hero;
