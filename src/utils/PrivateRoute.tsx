import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAppSelector((state: RootState) => state.auth);

  return isLoggedIn ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;

// PrivateRoute: Этот компонент проверяет, залогинен ли пользователь,
// используя состояние isLoggedIn из Redux. Если пользователь не авторизован,
// он перенаправляется на страницу /auth.
