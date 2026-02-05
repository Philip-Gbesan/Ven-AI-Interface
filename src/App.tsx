import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// App Pages
import Instants from './pages/app/Instants';
import Dashboard from './pages/app/instant/Dashboard';
import Data from './pages/app/instant/Data';
import Chat from './pages/app/instant/Chat';
import InstanceSettings from './pages/app/instant/Settings';
import Files from './pages/app/Files';
import Insights from './pages/app/Insights';
import Billing from './pages/app/Billing';
import UsageHistory from './pages/app/UsageHistory';
import Integration from './pages/app/Integration';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* App Routes (Redirect to Dashboard) */}
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app/instants" element={<Navigate to="/app/dashboard" replace />} />

            {/* MAIN MODE: Dashboard, Resources, Insights, Settings */}
            <Route element={<DashboardLayout mode="main" />}>
              <Route path="/app/dashboard" element={<Instants />} />
              <Route path="/app/files" element={<Files />} />
              <Route path="/app/insights" element={<Insights />} />
              <Route path="/app/billings" element={<Billing />} />
              <Route path="/app/billings/history" element={<UsageHistory />} />
              <Route path="/app/integration" element={<Integration />} />
            </Route>

            {/* INSTANT MODE: Specific Instant Context */}
            <Route path="/app/instant/:id" element={<DashboardLayout mode="instance" />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="data" element={<Data />} />
              <Route path="chat" element={<Chat />} />
              <Route path="settings" element={<InstanceSettings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
