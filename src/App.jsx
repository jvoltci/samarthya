import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
import LoadingSpinner from './components/shared/LoadingSpinner';
import Layout from './components/shared/Layout';
import AdminEquipment from './pages/Admin/Equipment/AdminEquipment';
import AdminEmployee from './pages/Admin/Employee/AdminEmployee';
import AdminAttendance from './pages/Admin/Attendance/AdminAttendance';
import AdminEmployeeProfile from './pages/Admin/Employee/AdminEmployeeProfile';
import AdminCourse from './pages/Admin/Course/AdminCourse';
import AdminBMI from './pages/Admin/BMI/AdminBMI';
import AdminMedical from './pages/Admin/Medical/AdminMedical';
import AdminLeave from './pages/Admin/Leave/AdminLeave';
import AdminUserManagement from './pages/Admin/UserManagement/AdminUserManagement';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => (
  <AuthProvider>
    <HashRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="employee" element={<AdminEmployee />} />
                    <Route path="employee/:id" element={<AdminEmployeeProfile />} />
                    <Route path="leave" element={<AdminLeave />} />
                    <Route path="course" element={<AdminCourse />} />
                    <Route path="bmi" element={<AdminBMI />} />
                    <Route path="medical" element={<AdminMedical />} />
                    <Route path="attendance" element={<AdminAttendance />} />
                    <Route path="equipment" element={<AdminEquipment />} />
                    <Route path="user" element={<AdminUserManagement />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />


          {/* Employee Routes */}
          <Route
            path="/employee/*"
            element={
              <ProtectedRoute roles={['employee']}>
                <Layout>
                  <AdminEmployeeProfile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </HashRouter>
  </AuthProvider>
);

export default App;

