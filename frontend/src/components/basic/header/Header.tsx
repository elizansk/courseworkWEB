import React from "react";
import "./Header.scss";
import LogoImg from "../../../assets/logo1.png";
import { useAuth } from "../../../context/AuthContext";

const Header: React.FC = () => {
    const { isAuth, logout } = useAuth();

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
                    <a href="/profile">Личный кабинет</a>
                    <button onClick={logout} className="header__nav__logout-btn">
                        Выйти
                    </button>
                </nav>
            )}
        </header>
    );
};

export default Header;
