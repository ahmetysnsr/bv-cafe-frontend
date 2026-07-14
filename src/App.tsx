import { Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import OrderPage from './pages/OrderPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TableScreen from './pages/TableScreen';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminSettings from './pages/AdminSettings';
import RobotTracker from './pages/RobotTracker';
import RobotMap from './pages/RobotMap';
import AdminLayout from './components/Layout/AdminLayout';
import ConnectionErrorPage from './components/ConnectionErrorPage';
import { useNetworkStore } from './stores/networkStore';

function App() {
  const isNetworkDown = useNetworkStore((state) => state.isDown);

  if (isNetworkDown) {
    return <ConnectionErrorPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/order/success" element={<OrderSuccessPage />} />
      <Route path="/table-screen" element={<TableScreen />} />
      <Route path="/robot-tracker" element={<RobotTracker />} />
      
      {/* Admin and Demo Pages wrapped in AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/robot-map" element={<RobotMap />} />
      </Route>
    </Routes>
  );
}

export default App;
