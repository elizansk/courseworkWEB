import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
    const { isAuth, loading } = useAuth();

    if (loading) return null;

    if (!isAuth) return <Navigate to="/auth" replace />;

    return <Outlet />;
};
