import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./pages/Home/HomePage";
import PridePage from "./pages/Pride/PridePage";
import ProfilePage from "./pages/Profile/teacherPanel/ProfilePage";
import CoursesPage from "./pages/Courses/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage/CourseDetailPage";
import PayPage from "./pages/Pay/PayPage";
import LessonsPage from "./pages/Lessons/LessonsPage";

import { MainLayout } from "./layout/MainLayout";
import { AuthLayout } from "./layout/AuthLayout";

import TeacherSubmissionsPage from "./pages/TeacherSubmissions/TeacherSubmissionsPage";
import TeacherProfilePage from "./pages/Profile/teacherPanel/TeacherProfilePage";
import TeacherCreateCourseForm from "./pages/TeacherCreateCourseForm/TeacherCreateCourseForm";

import CourseReviewPage from "./pages/Lessons/CourseReviewPage";

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
                    <Route path="/profile" element={<ProfilePage userRole="student" />} />
                    <Route path="/profile/course/:courseId/lessons" element={<LessonsPage />} />
                    <Route path="/profile/course/:courseId/review" element={<CourseReviewPage />} />
                    <Route path="/teacher" element={<TeacherProfilePage />} />
                    <Route path="/teacher/submissions" element={<TeacherSubmissionsPage />} />
                    <Route path="/teacher/create-course" element={<TeacherCreateCourseForm />} />

                    <Route path="/admin" element={<ProfilePage userRole="admin" />} />
                    <Route path="/payment/:courseId" element={<PayPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default App;
