import AdminLayout from "../../../layout/AdminLayout";
import { useApp } from "../../../context/AppContext";
import DashboardPageV2 from "../pages/DashboardPageV2";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import ProductsPage from "../pages/ProductsPage";

interface AdminAppProps {
  onLogout: () => void;
}

export default function AdminApp({ onLogout }: AdminAppProps) {
  const { adminPage, navigateToAdminPage } = useApp();

  const renderPage = () => {
    switch (adminPage) {
      case "dashboard":
        return <DashboardPageV2 />;
      case "orders":
        return <OrdersPage />;
      case "order-detail":
        return <OrderDetailPage />;
      case "products":
        return <ProductsPage />;
      case "analytics":
        return <div>Analytics Page (Coming Soon)</div>;
      case "support":
        return <div>Support Page (Coming Soon)</div>;
      case "settings":
        return <div>Settings Page (Coming Soon)</div>;
      default:
        return <DashboardPageV2 />;
    }
  };

  return (
    <AdminLayout
      currentPage={adminPage}
      onNavigate={navigateToAdminPage}
      onLogout={onLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
}
