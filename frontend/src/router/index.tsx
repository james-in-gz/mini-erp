import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import Orders from "../pages/OrderPage";
import CustomerDetailPage from "@/pages/customer/CustomerDetailPage";
import CustomerListPage from "@/pages/customer/CustomerListPage";
import CreateCustomerPage from "@/pages/customer/CreateCustomerPage";
import FollowUpPage from "@/pages/customer/FollowUpPage";
import { getToken } from "../utils/auth";
import MainLayout from "@/layout/MainLayout";

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
        <Route path="/" element={<FollowUpPage />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/create" element={<CreateCustomerPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />

        <Route path="/follow-ups" element={<FollowUpPage />} />
      </Route>
    </Routes>
  );
}