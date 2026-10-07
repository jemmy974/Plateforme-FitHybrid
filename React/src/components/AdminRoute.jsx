import { Navigate } from "react-router-dom";

const AdminRoute = ({children}) =>{
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') 

if (!token){
    return <Navigate to="/login" />
}

if (user) {
        const userData = JSON.parse(user);
        if (userData.role === 'admin' || userData.role === 'super_admin') {
            return children;
        }
    }
    
    // Si pas admin → rediriger vers login
    return <Navigate to="/login" />;
};


export const SuperAdminRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    try {
        const userData = JSON.parse(user);
        if (userData.role === 'super_admin') {
            return children;
        }
    } catch (error) {}
    
    return <Navigate to="/" />;
};


export default AdminRoute
