import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, fetchMe, refreshToken, user, loading } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const initialized = useRef(false);

  const initialize = async () => {
    if (!accessToken) {
      await refreshToken();
    }
    if (accessToken && !user) {
      await fetchMe();
    }
    setStarting(false);
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initialize();
    }
  }, []);

  // Conditional returns ở sau hooks
  if (starting || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet></Outlet>;
};

export default ProtectedRoute;
