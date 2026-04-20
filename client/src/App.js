import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Navbar from './components/Navbar';
import FloatingChatbot from './components/FloatingChatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Learning from './pages/Learning';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import Progress from './pages/Progress';
import Chatbot from './pages/Chatbot';

// Role-based protected route
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return element;
};

const dashboardByRole = (role) => {
  if (role === 'teacher') return '/teacher-dashboard';
  if (role === 'admin') return '/admin-dashboard';
  return '/student-dashboard';
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={dashboardByRole(user.role)} replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={dashboardByRole(user.role)} replace />} />
        <Route path="/unauthorized" element={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>Access Denied</h2>
            <p style={{ color: 'var(--text-secondary)' }}>You are not authorized to view this page.</p>
            <button className="btn btn-primary" onClick={() => window.history.back()}>Go Back</button>
          </div>
        } />

        {/* Student Routes */}
        <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} allowedRoles={['student']} />} />
        <Route path="/learning"          element={<ProtectedRoute element={<Learning />}         allowedRoles={['student']} />} />
        <Route path="/quiz"              element={<ProtectedRoute element={<Quiz />}              allowedRoles={['student']} />} />
        <Route path="/flashcards"        element={<ProtectedRoute element={<Flashcards />}        allowedRoles={['student']} />} />
        <Route path="/progress"          element={<ProtectedRoute element={<Progress />}          allowedRoles={['student']} />} />
        <Route path="/chatbot"           element={<ProtectedRoute element={<Chatbot />}           allowedRoles={['student']} />} />

        {/* Teacher Routes */}
        <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} allowedRoles={['teacher']} />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard"   element={<ProtectedRoute element={<AdminDashboard />}   allowedRoles={['admin']} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user && user.role === 'student' && <FloatingChatbot />}
    </>
  );
}

export default App;