import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {User} from "../types/User.ts";

interface AuthContextType {
    isAuth: boolean;
    login: (userData: any) => void;
    logout: () => void;
    loading: boolean;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setIsAuth(true);
            setUser(JSON.parse(user));
        }
        setLoading(false);   // ← важно
    }, []);

    const login = (userData: any) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData as User);
        setIsAuth(true);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsAuth(false);
    };

    return (
        <AuthContext.Provider value={{ isAuth, login, logout, loading, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
