
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import API_BASE_URL from "../api";

const ProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/me`,
          {
            credentials: "include",
          }
        );

        setAuthenticated(response.ok);
      } catch {
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return <p>Checking login...</p>;
  }

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
};

export default ProtectedRoute;
