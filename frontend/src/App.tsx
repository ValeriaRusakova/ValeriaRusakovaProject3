// Root of the app — wraps everything in AuthProvider + BrowserRouter.
// All route guards (ProtectedRoute / AdminRoute) live here.

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import About from './pages/About';
import AddVacation from './pages/AddVacation';
import AdminVacations from './pages/AdminVacations';
import AiPage from './pages/AiPage';
import EditVacation from './pages/EditVacation';
import Login from './pages/Login';
import McpPage from './pages/McpPage';
import Register from './pages/Register';
import Reports from './pages/Reports';
import Vacations from './pages/Vacations';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>

          {/* ── Public ──────────────────────────────────────────────── */}
          <Route path="/about"    element={<About />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Protected (logged-in users + admins) ────────────────── */}
          <Route path="/vacations" element={
            <ProtectedRoute><Vacations /></ProtectedRoute>
          } />
          <Route path="/ai" element={
            <ProtectedRoute><AiPage /></ProtectedRoute>
          } />
          <Route path="/mcp" element={
            <ProtectedRoute><McpPage /></ProtectedRoute>
          } />

          {/* ── Admin only ───────────────────────────────────────────── */}
          <Route path="/admin" element={
            <AdminRoute><AdminVacations /></AdminRoute>
          } />
          <Route path="/add-vacation" element={
            <AdminRoute><AddVacation /></AdminRoute>
          } />
          <Route path="/edit-vacation/:id" element={
            <AdminRoute><EditVacation /></AdminRoute>
          } />
          <Route path="/reports" element={
            <AdminRoute><Reports /></AdminRoute>
          } />

          {/* ── Default / 404 ────────────────────────────────────────── */}
          <Route path="/"  element={<Navigate to="/about" replace />} />
          <Route path="*"  element={<Navigate to="/about" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
