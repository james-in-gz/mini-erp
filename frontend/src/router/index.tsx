import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import Orders from "../pages/OrderPage";
import CustomerDetailPage from "../pages/customer/CustomerDetailPage";
import CustomerListPage from "@/pages/customer/CustomerListPage";
import { getToken } from "../utils/auth";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  console.log("当前token：", getToken());
  return getToken() ? children : <Navigate to="/login" />;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <HomePage />
        </PrivateRoute>
      } />
      <Route path="/orders" element={
        <PrivateRoute>
          <Orders />
        </PrivateRoute>
      } />
      <Route path="/customers/:id" element={
        <PrivateRoute>
          <CustomerDetailPage />
        </PrivateRoute>
      } />
      <Route path="/customers" element={
      <PrivateRoute>
          <CustomerListPage />
        </PrivateRoute>
      } />
    </Routes>
  );
}
