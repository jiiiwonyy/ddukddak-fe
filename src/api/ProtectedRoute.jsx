import { useNavigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "./auth";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login", { replace: true });
    }
  }, [loggedIn, navigate]);

  if (!isLoggedIn()) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
