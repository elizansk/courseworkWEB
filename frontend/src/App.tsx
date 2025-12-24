import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./pages/Home/HomePage";
import AboutPage from "./pages/About/AboutPage";

import { MainLayout } from "./layout/MainLayout.tsx";
import { AuthLayout } from "./layout/AuthLayout";

const App = () => (
    <BrowserRouter>
        <Routes>

            <Route path="/auth" element={<AuthPage />} />

            <Route element={<AuthLayout />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    </BrowserRouter>
);

export default App;
