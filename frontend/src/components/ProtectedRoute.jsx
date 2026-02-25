import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? children : <Navigate to="/" />;
}
