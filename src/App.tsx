import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// App Pages
import Instances from './pages/app/Instances';
import Dashboard from './pages/app/instance/Dashboard';
import Data from './pages/app/instance/Data';
import Chat from './pages/app/instance/Chat';
import InstanceSettings from './pages/app/instance/Settings';
import GlobalResources from './pages/app/GlobalResources';
import Insights from './pages/app/Insights';
import Settings from './pages/app/Settings';

function App() {
  return (
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
          <Route path="/app/instances" element={<Navigate to="/app/dashboard" replace />} />

          {/* MAIN MODE: Dashboard, Resources, Insights, Settings */}
          <Route element={<DashboardLayout mode="main" />}>
            <Route path="/app/dashboard" element={<Instances />} />
            <Route path="/app/resources" element={<GlobalResources />} />
            <Route path="/app/insights" element={<Insights />} />
            <Route path="/app/settings" element={<Settings />} />
          </Route>

          {/* INSTANCE MODE: Specific Instance Context */}
          <Route path="/app/instance/:id" element={<DashboardLayout mode="instance" />}>
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
  );
}

export default App;
