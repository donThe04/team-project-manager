import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore.js";

// Bảo vệ các route cần đăng nhập
// Nếu chưa auth → redirect về /login
// Nếu đã auth → render children bình thường
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
