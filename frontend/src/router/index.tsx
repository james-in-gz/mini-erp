import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import HomePage from "../pages/Home";
import Orders from "../pages/Orders";
import CustomerDetailPage from "../pages/customer/CustomerDetailPage";
import CustomerListPage from "@/pages/customer/CustomerListPage";
import { getToken } from "../utils/auth";

function PrivateRoute({ children }: { children: React.ReactNode }) {
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
