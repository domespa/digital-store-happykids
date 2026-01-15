import AdminLayout from "../../layout/AdminLayout";
import { useApp } from "../../context/AppContext";
import DashboardPageV2 from "../../pages/admin/DashboardPageV2";
import OrdersPage from "../../pages/admin/OrdersPage";
import OrderDetailPage from "../../pages/admin/OrderDetailPage";
// import UsersOnlinePage from "../../pages/admin/UsersOnlinePage";
// import UserMapPage from "../../pages/admin/UserMapPage";
import ProductsPage from "../../pages/admin/ProductsPage";

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
      // case "users-online":
      // return <UsersOnlinePage />;
      // case "user-map":
      // return <UserMapPage />;
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
