import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[]; // Список дозволених ролей
};

const PrivateRoute = ({ children, allowedRoles }: Props) => {
  const { isLoggedIn, role } = useAppSelector((state: RootState) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/no-access" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
