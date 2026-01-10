import React from "react";
import "./Header.scss";
import LogoImg from "../../../assets/logo1.png";
import { useAuth } from "../../../context/AuthContext";

const Header: React.FC = () => {
    const { isAuth, logout, user } = useAuth();
    const role = user?.roles.sort((a, b) => a - b)[0]

    return (
        <header className="header">
            <div className="header__logo">
                <img src={LogoImg} alt="Logo" />
                <span>LearnSpace</span>
            </div>

            {isAuth && (
                <nav className="header__nav">
                    <a href="/">Главная</a>
                    <a href="/courses">Курсы</a>
                    <a href="/pride">Наша гордость</a>
                    {role === 3 && <a href="/profile">Личный кабинет</a>}
                    {role === 2 && <a href="/teacher">Кабинет преподавателя</a>}
                    {role === 1 && <a href="/admin">Админ-панель</a>}
                    <button onClick={logout} className="header__nav__logout-btn">
                        Выйти
                    </button>
                </nav>
            )}
        </header>
    );
};

export default Header;
