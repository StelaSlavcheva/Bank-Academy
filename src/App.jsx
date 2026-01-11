import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './components/layout/SidebarLayout';
// ... imports
import LandingPage from './pages/LandingPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import CoursePlayer from './pages/course/CoursePlayer';
import LoginPage from './pages/auth/LoginPage';
// Admin Imports
import CourseList from './pages/admin/CourseList';
import CourseForm from './pages/admin/CourseForm';
import Nomenclatures from './pages/admin/Nomenclatures';
import FeedbackAdmin from './pages/admin/FeedbackAdmin';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import Compliance from './pages/admin/Compliance';
// Survey Imports
import SurveyList from './pages/surveys/SurveyList';
import SurveyForm from './pages/surveys/SurveyForm';
// Certificate Import
import Certificates from './pages/certificates/Certificates';
// Catalog Import
import Catalog from './pages/catalog/Catalog';
// Progress Import
import Progress from './pages/progress/Progress';
// Assignments Import
import Assignments from './pages/assignments/Assignments';

import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

// Layout wrapper for authenticated pages
const ProtectedLayout = ({ children }) => (
    <SidebarLayout>
        {children}
    </SidebarLayout>
);

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<LandingPage />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <DashboardHome />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/course/:courseId" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <CoursePlayer />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            {/* CATALOG ROUTE */}
            <Route path="/catalog" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <Catalog />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            {/* PROGRESS ROUTE */}
            <Route path="/progress" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <Progress />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            {/* ATTESTATIONS / ASSIGNMENTS ROUTE */}
            <Route path="/attestations" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <Assignments />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            {/* ADMIN ROUTES */}
            <Route path="/admin/courses" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <CourseList />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/admin/create-course" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <CourseForm />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/admin/edit-course/:id" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <CourseForm />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/admin/nomenclatures" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <Nomenclatures />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/admin/feedback" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <FeedbackAdmin />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <UserManagement />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/admin/analytics" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <Analytics />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/admin/compliance" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <Compliance />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            {/* SURVEY ROUTES */}
            <Route path="/surveys" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <SurveyList />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="/surveys/:id" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <SurveyForm />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            {/* CERTIFICATES ROUTE */}
            <Route path="/certificates" element={
                <ProtectedRoute>
                    <ProtectedLayout>
                        <Certificates />
                    </ProtectedLayout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<div>Страницата не е намерена</div>} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
