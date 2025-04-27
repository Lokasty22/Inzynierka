import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ allowedRoles }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/me", {
                    headers: { "x-auth-token": token },
                });
                setUser(response.data); 
            } catch (error) {
                console.error("Błąd pobierania danych użytkownika:", error);
            } finally {
                setLoading(false); 
            }
        };

        if (token) {
            fetchUser(); 
        } else {
            setLoading(false); 
        }
    }, [token]);

    if (loading) return null; 

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/nieautoryzowany-dostep" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
