import React from "react";
import "../../styles/components/footer.scss";

const Footer: React.FC = () => (
    <footer className="footer">
        <div>© {new Date().getFullYear()} LearnSpace — Все права защищены</div>
        <div className="links">
            <a href="#">Политика</a>
            <a href="#">Условия</a>
            <a href="#">Контакты</a>
        </div>
    </footer>
);

export default Footer;
