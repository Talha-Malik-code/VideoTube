import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userStatus = useSelector((state) => state.user.status);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  if (userStatus === "loading") {
    return <h3 className="mx-auto">Loading...</h3>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
