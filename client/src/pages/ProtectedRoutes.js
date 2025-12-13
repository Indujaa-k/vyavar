import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  deliveryOnly = false,
  userOnly = false,
}) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const location = useLocation();

  // If route requires any authentication but no user is logged in
  if ((adminOnly || deliveryOnly || userOnly) && !userInfo) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // Route requires admin but user isn't admin
  if (adminOnly && !userInfo?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Route requires delivery but user isn't delivery
  if (deliveryOnly && !userInfo?.isDelivery) {
    return <Navigate to="/" replace />;
  }

  // Route requires regular user but user is admin/delivery
  if (userOnly && (userInfo?.isAdmin || userInfo?.isDelivery)) {
    return (
      <Navigate
        to={userInfo.isAdmin ? "/admin" : "/deliveryhomepage"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
