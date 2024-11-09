import { Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = () => {
  if (!localStorage.getItem("accessToken")) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
