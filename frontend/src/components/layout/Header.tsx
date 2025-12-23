import React from "react";
import "../../styles/components/header.scss";
import LogoImg from "../../assets/logo.svg";

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header__logo">
                <img src={LogoImg} alt="Logo" />
                <span>LearnSpace</span>
            </div>

            <nav className="header__nav">
                <a href="#">Главная</a>
                <a href="#">Курсы</a>
                <a href="#">О нас</a>
                <a href="#">Личный кабинет</a>
            </nav>
        </header>
    );
};

export default Header;
