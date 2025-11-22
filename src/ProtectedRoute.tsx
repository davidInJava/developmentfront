import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "citizen" | "agency";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  role,
}) => {
  const location = useLocation();

  const token =
    role === "agency"
      ? localStorage.getItem("jwtAgency")
      : localStorage.getItem("jwtCitizen");

  const isOnLoginOrRegister =
    location.pathname.endsWith("/login") ||
    location.pathname.endsWith("/register");

  if (!token) {
    if (!isOnLoginOrRegister) {
      return (
        <Navigate
          to={role === "agency" ? "/agency/login" : "/citizen/login"}
          replace
        />
      );
    }
    return <>{children}</>;
  }
  return <>{children}</>;
};
