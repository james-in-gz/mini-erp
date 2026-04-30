import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Orders from "../pages/Orders";
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
          <Home />
        </PrivateRoute>
      } />
      <Route path="/orders" element={
        <PrivateRoute>
          <Orders />
        </PrivateRoute>
      } />
    </Routes>
  );
}