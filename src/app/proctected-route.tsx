import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    const loggedInUser = localStorage.getItem("logged-in-user"); // Check for the token

    return token || loggedInUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
