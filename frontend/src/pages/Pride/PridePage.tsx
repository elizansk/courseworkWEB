import React from "react";
import "./PridePage.scss";


const students = [
    {
        id: 1,
        name: "Иван Петров",
        role: "Backend Developer в Яндекс",
        story: "Пришёл к нам из бухгалтерии. Теперь пишет микросервисы на Go и участвует в архитектуре высоконагруженных систем.",
        image: "https://sun9-53.userapi.com/s/v1/ig2/IG4SaIB6Zh4rRJS5ndUCRMBD2gzmu4GlpBdKz6ImjQNLJx16BQZOpysAVw8jLVntMKhHNwz4LtZ4A6osS2x-KPCf.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x214,240x320,360x481,480x641,540x721,640x855,720x961,1080x1442,1280x1709,1342x1792&from=bu&cs=1280x0"
    },
    {
        id: 2,
        name: "Анна Смирнова",
        role: "Frontend Developer в Ozon",
        story: "Начинала с нуля, за 6 месяцев освоила React и теперь работает в крупной продуктовой команде.",
        image: "https://sun9-24.userapi.com/s/v1/ig2/H0uMpHNAbB-OOI1OAPgrgILJfsEA9YV7jcGlD3guKKCbqiVbolieBT10-qbK-jcxBFOkvOXy9OCo1Fs0oUbqBSJz.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,624x832&from=bu&cs=624x0"
    },
    {
        id: 3,
        name: "Дмитрий Иванов",
        role: "ML Engineer в Tinkoff",
        story: "Прошёл курс по ML и устроился в лабораторию, где занимается моделями прогнозирования.",
        image: "https://sun9-6.userapi.com/s/v1/ig2/jmTXsc005vT-X3twz5CmDkbeVpw2v-XZbZh5OwR74gerLNsOy6VAItqzYq7L09tDUtDxhCbGKyhlmX8iu0bBBVyP.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960,1440x1080,2560x1920&from=bu&cs=2560x0"
    },
    {
        id: 4,
        name: "Мария Орлова",
        role: "UI/UX Designer (freelance)",
        story: "Сменила профессию и теперь ведёт проекты для международных клиентов, создала крутое портфолио.",
        image: "https://sun9-21.userapi.com/s/v1/ig2/flmM613pC1e8TiCxXB2xxnJ93LQVM1fVeS9L5EIpq6O3rcXIyfDaxk6JSgds2qr1kVGCjhxn4tW3koSi9PJIOfZZ.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1920x0"
    },
    {
        id: 5,
        name: "Алексей Смирнов",
        role: "DevOps Engineer в SberTech",
        story: "Освоил CI/CD и Kubernetes на практике, теперь отвечает за деплой и инфраструктуру в команде.",
        image: "https://sun9-69.userapi.com/s/v1/ig2/hdN6foANLYRk89wbKPHAoVuczbJD8pEsOHFqYebdoU6n_UXmK-5dqXMVc-kJ20NnB_qJUxl2eC22OIy0_NCyehZd.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x303,640x359,720x404,748x420&from=bu&cs=748x0"
    },
    {
        id: 6,
        name: "Екатерина Лебедева",
        role: "Data Analyst в DataLab",
        story: "Сначала аналитик в банке, теперь строит модели предсказаний и визуализирует данные для крупных компаний.",
        image: "https://sun9-83.userapi.com/s/v1/ig2/4xVr2KD0bDJ0kGsRmlxiYpi3tP04qlmBODVQOxzpWA49iE6CPAe4boTcQu48c2VTzEud2ExkAbbJgpdxztm00-qe.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1920x0"
    },
    {
        id: 7,
        name: "Олег Новиков",
        role: "Fullstack Developer в Wildberries",
        story: "Прокачал навыки фронтенд и бэкенд разработки, теперь создаёт современные веб-приложения.",
        image: "https://sun9-48.userapi.com/s/v1/ig2/kQdaB_x7SsWuvLzH999j2eH32e-MNRc-eogqSSiwTHIrw2aEmQwrbo2d2OS7HG_e8lOeYUc7rhHySc60rS4dTqvw.jpg?quality=95&as=32x71,48x107,72x160,108x240,160x356,240x533,360x800,480x1067,540x1200,576x1280&from=bu&cs=576x0"
    },
    {
        id: 8,
        name: "Владислав Смирнов",
        role: "Product Designer в Tinkoff",
        story: "Сменил профессию и теперь проектирует интерфейсы для мобильных приложений и веб-сервисов.",
        image: "https://sun9-79.userapi.com/s/v1/ig1/a1gXVYt2rw2IloVejvthnm63PgXpOhaCNtsi_SX0SCrgA1uUnkrYTTPltFoaxW4-4DjQJp1M.jpg?quality=96&as=32x43,48x64,72x96,108x144,160x213,240x319,360x479,480x639,540x719,577x768&from=bu&cs=577x0"
    },
    {
        id: 9,
        name: "Наталья Сергеева",
        role: "Blockchain Developer",
        story: "Изучила Solidity и теперь разрабатывает смарт-контракты для децентрализованных приложений.",
        image: "https://sun9-11.userapi.com/s/v1/ig2/CoRQvpvkg5mENU4XnQOEb_CZtpKCdnfJTz4BCNJ51eAs6NyWbAnSAtDL_bo25Y7sYFKJinoXp_avd8_1SWMNf4KC.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x853,720x960,1080x1440,1280x1707,1440x1920,1920x2560&from=bu&cs=1920x0"
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