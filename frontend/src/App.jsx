import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Auth/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CheckIn = lazy(() => import('./pages/Operator/CheckIn'));
const CheckOut = lazy(() => import('./pages/Operator/CheckOut'));
const ActiveVehicles = lazy(() => import('./pages/Operator/ActiveVehicles'));
const Settings = lazy(() => import('./pages/Admin/Settings'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/check-in" element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          } />
          
          <Route path="/check-out" element={
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          } />
          
          <Route path="/active" element={
            <ProtectedRoute>
              <ActiveVehicles />
            </ProtectedRoute>
          } />
          
          <Route path="/rates" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
