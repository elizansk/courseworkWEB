import React, { useState } from "react";
import "./Register.scss";

interface RegisterProps {
    onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleRegister = async () => {
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/auth/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onRegisterSuccess();
                alert("Регистрация прошла успешно! Теперь можно войти.");
                setEmail("");
                setPassword("");
            } else {
                setError(data.error || "Ошибка регистрации");
            }
        } catch (err) {
            setError("Не удалось подключиться к серверу");
        }
    };

    return (
        <div className="auth-form">
            <h2>Регистрация</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Зарегистрироваться</button>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Register;
