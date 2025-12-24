import React, { useState } from "react";
import "./AuthPage.scss";
import Login from "../../components/auth/login/Login";
import Register from "../../components/auth/register/Register";
import {useAuth} from "../../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
    const { login } = useAuth();
    const [isLoginView, setIsLoginView] = useState<boolean>(true);
    const navigate = useNavigate();
    const toggleView = () => setIsLoginView(!isLoginView);

    const handleLoginSuccess = (user: any) => {
        console.log(user)
        login(user);
        navigate("/");
    };

    const handleRegisterSuccess = () => setIsLoginView(true);

    return (
        <div className="auth-container">
            {isLoginView ? (
                <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
                <Register onRegisterSuccess={handleRegisterSuccess} />
            )}
            <div className="toggle">
                {isLoginView ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                <span onClick={toggleView} className="link">
                    {isLoginView ? "Зарегистрироваться" : "Войти"}
                </span>
            </div>
        </div>
    );
};

export default AuthPage;
