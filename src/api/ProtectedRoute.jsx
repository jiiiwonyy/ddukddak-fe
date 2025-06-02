import { useNavigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "./auth";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (!isLoggedIn()) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
