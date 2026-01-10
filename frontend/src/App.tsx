import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./pages/Home/HomePage";
import PridePage from "./pages/Pride/PridePage.tsx";
import ProfilePage from "./pages/Profile/ProfilePage";
import CoursesPage from "./pages/Courses/CoursesPage.tsx";
import CourseDetailPage from "./pages/CourseDetailPage/CourseDetailPage.tsx";
import PayPage from "./pages/Pay/PayPage";
import LessonsPage from "./pages/Lessons/LessonsPage.tsx";

import { MainLayout } from "./layout/MainLayout.tsx";
import { AuthLayout } from "./layout/AuthLayout";
import TeacherSubmissionsPage from "./pages/TeacherSubmissions/TeacherSubmissionsPage.tsx";



const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route element={<AuthLayout />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/pride" element={<PridePage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/course/:slug" element={<CourseDetailPage />} />
                    <Route path="/profile/course/:slug/lessons" element={<LessonsPage />} />
                    <Route path="/profile" element={<ProfilePage userRole="student" />} />
                    <Route path="/teacher" element={<ProfilePage userRole="teacher" />} />
                    <Route path="/admin" element={<ProfilePage userRole="admin" />} />
                    <Route path="/payment/:courseId" element={<PayPage />} />
                    <Route path="/teacher/submissions" element={<TeacherSubmissionsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default App;
