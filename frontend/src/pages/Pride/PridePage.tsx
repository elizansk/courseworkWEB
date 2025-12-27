import React from "react";
import "./PridePage.scss";


const students = [
    {
        id: 1,
        name: "Иван Петров",
        role: "Backend Developer в Яндекс",
        story: "Пришёл к нам из бухгалтерии. Теперь пишет микросервисы на Go и участвует в архитектуре высоконагруженных систем.",
        image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
        id: 2,
        name: "Анна Смирнова",
        role: "Frontend Developer в Ozon",
        story: "Начинала с нуля, за 6 месяцев освоила React и теперь работает в крупной продуктовой команде.",
        image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
        id: 3,
        name: "Дмитрий Иванов",
        role: "ML Engineer в Tinkoff",
        story: "Прошёл курс по ML и устроился в лабораторию, где занимается моделями прогнозирования.",
        image: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
        id: 4,
        name: "Мария Орлова",
        role: "UI/UX Designer (freelance)",
        story: "Сменила профессию и теперь ведёт проекты для международных клиентов, создала крутое портфолио.",
        image: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
        id: 5,
        name: "Алексей Смирнов",
        role: "DevOps Engineer в SberTech",
        story: "Освоил CI/CD и Kubernetes на практике, теперь отвечает за деплой и инфраструктуру в команде.",
        image: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
        id: 6,
        name: "Екатерина Лебедева",
        role: "Data Analyst в DataLab",
        story: "Сначала аналитик в банке, теперь строит модели предсказаний и визуализирует данные для крупных компаний.",
        image: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
        id: 7,
        name: "Олег Новиков",
        role: "Fullstack Developer в Wildberries",
        story: "Прокачал навыки фронтенд и бэкенд разработки, теперь создаёт современные веб-приложения.",
        image: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
        id: 8,
        name: "Светлана Орлова",
        role: "Product Designer в Tinkoff",
        story: "Сменила профессию и теперь проектирует интерфейсы для мобильных приложений и веб-сервисов.",
        image: "https://randomuser.me/api/portraits/women/8.jpg"
    },
    {
        id: 9,
        name: "Наталья Сергеева",
        role: "Blockchain Developer",
        story: "Изучила Solidity и теперь разрабатывает смарт-контракты для децентрализованных приложений.",
        image: "https://randomuser.me/api/portraits/women/9.jpg"
    }
];


const PridePage: React.FC = () => {
    return (
        <section className="pride">
            <div className="container">
                <h1>Наша гордость</h1>
                <p className="subtitle">
                    Наши выпускники — талантливые специалисты, которые нашли себя в IT и строят успешную карьеру.
                    Мы гордимся каждым ❤️
                </p>

                <div className="grid">
                    {students.map((s) => (
                        <div key={s.id} className="card">
                            <img src={s.image} alt={s.name} />
                            <div className="info">
                                <h3>{s.name}</h3>
                                <p className="role">{s.role}</p>
                                <p className="story">{s.story}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PridePage;