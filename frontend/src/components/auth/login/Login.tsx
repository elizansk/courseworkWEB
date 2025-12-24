import React, { useState } from "react";
import "./Login.scss";

interface LoginProps {
    onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleLogin = async () => {
        setError("");

        try {
         //   const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login/", {
         //       method: "POST",
         //       headers: { "Content-Type": "application/json" },
         //       body: JSON.stringify({ email, password }),//  });
            //  const data = await response.json();

           // if (response.ok) {
            //    let user = JSON.stringify(data);
            const user = {name: "test", password: "test"};
            console.log(user);
            localStorage.setItem("user", JSON.stringify(user));
            onLoginSuccess(user);
            //    onLoginSuccess(data);
           // } else {
           //     setError(data.error || "Ошибка входа");
         //   }
        } catch (err) {
            setError("Не удалось подключиться к серверу");
        }
    };

    return (
        <div className="auth-form">
            <h2>Вход в систему</h2>
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
            <button onClick={handleLogin}>Войти</button>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Login;
