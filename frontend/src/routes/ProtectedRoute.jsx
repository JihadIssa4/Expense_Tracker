import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  // 1. Wait until auth state is resolved
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  // 2. Not authenticated → redirect
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. Authenticated → render nested routes
  return <Outlet />;
}

export default ProtectedRoute;
