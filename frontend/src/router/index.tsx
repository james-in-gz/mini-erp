import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage";
import CustomerDetailPage from "@/pages/customer/CustomerDetailPage";
import CustomerListPage from "@/pages/customer/CustomerListPage";
import CreateCustomerPage from "@/pages/customer/CreateCustomerPage";
import FollowUpPage from "@/pages/customer/FollowUpPage";
import { getToken } from "../utils/auth";
import MainLayout from "@/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import PipelinePage from "@/pages/customer/PipelinePage";
import OrderDetailPage from "@/pages/order/OrderDetailPage";
import OrdersPage from "@/pages/order/OrdersPage";
import CreateOrderPage from "@/pages/order/CreateOrderPage";
import ProductPage from "@/pages/product/ProductPage";
import ShipmentPage from "@/pages/order/ShipmentPage";
import StockOutPage from "@/pages/product/StockOutPage";
import StockInPage from "@/pages/product/StockInPage";
import InventoryPage from "@/pages/product/InventoryPage";
import SKUPage from "@/pages/product/SKUPage";
import ProductDetailPage from "@/pages/product/ProductDetailPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = getToken();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function Router() {
  return (
    <Routes>
      {/* ❌ 不需要登录 */}
      <Route path="/login" element={<Login />} />

      {/* ✅ 需要登录 + Layout */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* 默认首页 */}
        <Route path="/" element={<DashboardPage />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/create" element={<CreateCustomerPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />

        <Route path="/follow-ups" element={<FollowUpPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/orders/create" element={<CreateOrderPage />} />
        <Route path="/orders/:id/ship" element={<ShipmentPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/:productId/sku/:id" element={<SKUPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/stock-in" element={<StockInPage />} />
        <Route path="/inventory/stock-out" element={<StockOutPage />} />

      </Route>
    </Routes>
  );
}