import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    isAuth: boolean;
    login: (userData: any) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) setIsAuth(true);
        setLoading(false);   // ← важно
    }, []);

    const login = (userData: any) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setIsAuth(true);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider value={{ isAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
