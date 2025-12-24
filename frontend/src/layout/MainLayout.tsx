import Header from "../components/basic/header/Header";
import Footer from "../components/basic/footer/Footer";
import { Outlet } from "react-router-dom";

export const MainLayout = () => (
    <>
        <Header />
        <Outlet />
        <Footer />
    </>
);
