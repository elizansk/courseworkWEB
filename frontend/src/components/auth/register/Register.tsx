import React, { useState } from "react";
import "./Register.scss";

interface RegisterProps {
    onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        password_confirm: ""
    });

    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async () => {
        setError("");

        if (formData.password !== formData.password_confirm) {
            return setError("Пароли не совпадают");
        }

        try {
            console.log(JSON.stringify(formData))
            const response = await fetch(`${API_URL}/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Регистрация прошла успешно!");
                onRegisterSuccess();
            } else {
                setError(JSON.stringify(data));
            }
        } catch (err) {
            setError("Ошибка подключения к серверу");
        }
    };

    return (
        <div className="auth-form">
            <h2>Регистрация</h2>

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />

            <input
                name="first_name"
                type="text"
                placeholder="Имя"
                value={formData.first_name}
                onChange={handleChange}
            />

            <input
                name="last_name"
                type="text"
                placeholder="Фамилия"
                value={formData.last_name}
                onChange={handleChange}
            />

            <input
                name="phone"
                type="text"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
            />

            <input
                name="password"
                type="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
            />

            <input
                name="password_confirm"
                type="password"
                placeholder="Повторите пароль"
                value={formData.password_confirm}
                onChange={handleChange}
            />

            <button onClick={handleRegister}>Зарегистрироваться</button>

            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Register;
