import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/Operator/CheckIn';
import CheckOut from './pages/Operator/CheckOut';
import ActiveVehicles from './pages/Operator/ActiveVehicles';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
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
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
