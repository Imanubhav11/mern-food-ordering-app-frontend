import LoadingButton from "@/components/LoadingButton";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingButton></LoadingButton>
   
  }

  //if the user is authenticated we have to render the child routes 
  if (isAuthenticated) {
    return <Outlet />;
  }

  //else we navigate the user to the home page
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;