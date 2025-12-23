import Header from "../components/layout/Header";
import HeroSection from "../components/sections/HeroSection";
import CoursesSection from "../components/sections/CoursesSection";
import Footer from "../components/layout/Footer";

const Home: React.FC = () => (
    <>
        <Header />
        <main>
            <HeroSection />
            <CoursesSection />
        </main>
        <Footer />
    </>
);

export default Home;
