import React from "react";
import "./aboutSection.scss";
import {  FaLaptopCode, FaRocket, FaCertificate, FaUsers  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AboutSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="about-section">
            <div className="container">
                <h2>О нашей академии</h2>
                <p className="intro">
                    Мы обучаем специалистов будущего в IT, Data Science, DevOps и Frontend-разработке.
                    Наши курсы подходят как для новичков, так и для опытных специалистов, которые хотят прокачать навыки
                    и работать над реальными проектами. Присоединяйтесь к нам, чтобы развиваться и достигать карьерных целей!
                </p>

                <div className="cards">
                    <div className="card">
                        <FaUsers className="icon" />
                        <h3>Для кого мы</h3>
                        <p>
                            Для начинающих и опытных специалистов, желающих освоить новые технологии,
                            сменить профессию или углубить знания в IT.
                        </p>
                    </div>

                    <div className="card">
                        <FaRocket className="icon" />
                        <h3>Почему мы крутые</h3>
                        <p>
                            Практика на реальных проектах, опытные преподаватели, современные технологии,
                            индивидуальный подход и поддержка в трудоустройстве.
                        </p>
                    </div>

                    <div className="card">
                        <FaLaptopCode className="icon" />
                        <h3>Что изучите</h3>
                        <p>
                            Frontend, Backend, DevOps, Data Science, микросервисы, CI/CD, контейнеризацию,
                            работу с базами данных и современными инструментами разработки.
                        </p>
                    </div>

                    <div className="card">
                        <FaCertificate className="icon" />
                        <h3>Результат</h3>
                        <p>
                            После обучения вы сможете разрабатывать реальные проекты, получать сертификаты,
                            улучшить портфолио и начать карьеру в IT с уверенностью.
                        </p>
                    </div>
                </div>

                <button className="btn" onClick={() => navigate("/courses")}>
                    Записаться
                </button>
            </div>
        </section>
    );
};

export default AboutSection;