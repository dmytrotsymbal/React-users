import { Container } from "@mui/material";
import Header from "./layouts/Header";
import "./styles/App.css";
import "./styles/font.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import CustomLoader from "./components/ui/CustomLoader";
import ScrollToTop from "./utils/scrollToTop";
import PrivateRoute from "./utils/PrivateRoute";
import { useAppSelector } from "./redux/hooks";
import { RootState } from "./redux/store";

const AuthPage = lazy(() => import("./pages/Auth/AuthPage"));
const UsersPage = lazy(() => import("./pages/Users/UsersPage"));
const UserDetailsPage = lazy(() => import("./pages/Users/UserDetailsPage"));
const EditUserPage = lazy(() => import("./pages/Users/EditUserPage"));
const AddUserPage = lazy(() => import("./pages/Users/AddUserPage"));
const CarsPage = lazy(() => import("./pages/Cars/CarsPage"));
const EditCarPage = lazy(() => import("./pages/Cars/EditCarPage"));
const AddCarPage = lazy(() => import("./pages/Cars/AddCarPage"));
const AddressDetailsPage = lazy(
  () => import("./pages/Addresses/AddressDetailsPage")
);
const EditAddressPage = lazy(() => import("./pages/Addresses/EditAddressPage"));
const AddAddressPage = lazy(() => import("./pages/Addresses/AddAddressPage"));
const EditCrimePage = lazy(() => import("./pages/Crimes/EditCrimePage"));
const AddCrimePage = lazy(() => import("./pages/Crimes/AddCrimePage"));
const NoAccessPage = lazy(() => import("./pages/NoAccess/NoAccessPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

function App() {
  const { isLoggedIn } = useAppSelector((state: RootState) => state.auth);
  const lightTheme = useAppSelector((state) => state.theme.lightTheme);
  return (
    <>
      <Header />

      <main className={lightTheme ? "main" : "main-dark"}>
        <ScrollToTop />
        <Container maxWidth="xl">
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CustomLoader />
              </div>
            }
          >
            <Routes>
              <Route path="/auth" element={<AuthPage />} />

              <Route
                path="/users"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "moderator", "visitor"]}
                  >
                    <UsersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/:userId"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "moderator", "visitor"]}
                  >
                    <UserDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/edit/:userId"
                element={
                  <PrivateRoute allowedRoles={["admin", "moderator"]}>
                    <EditUserPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/add"
                element={
                  <PrivateRoute allowedRoles={["admin", "moderator"]}>
                    <AddUserPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/cars"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "moderator", "visitor"]}
                  >
                    <CarsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/car/edit/:carId"
                element={
                  <PrivateRoute allowedRoles={["admin", "moderator"]}>
                    <EditCarPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/car/add/:userId"
                element={
                  <PrivateRoute allowedRoles={["admin", "moderator"]}>
                    <AddCarPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/address/:addressId"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "moderator", "visitor"]}
                  >
                    <AddressDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/address/edit/:addressId"
                element={
                  <PrivateRoute allowedRoles={["admin", "moderator"]}>
                    <EditAddressPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/address/add/:userId"
                element={
                  <PrivateRoute allowedRoles={["admin", "moderator"]}>
                    <AddAddressPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/crime/edit/:crimeId"
                element={
                  <PrivateRoute allowedRoles={["admin", "moderator"]}>
                    <EditCrimePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/crime/add/:userId"
                element={
                  <PrivateRoute allowedRoles={["admin", "moderator"]}>
                    <AddCrimePage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/"
                element={
                  <Navigate
                    to={isLoggedIn === true ? "/users" : "/auth"}
                    replace
                  />
                }
              />

              <Route path="/no-access" element={<NoAccessPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </Container>
      </main>
    </>
  );
}

export default App;
