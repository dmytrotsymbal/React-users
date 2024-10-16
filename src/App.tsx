import { Container } from "@mui/material";
import Header from "./components/Header";
import "./styles/App.css";
import "./styles/font.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import CustomLoader from "./components/ui/CustomLoader";
import ScrollToTop from "./utils/scrollToTop";
import PrivateRoute from "./utils/PrivateRoute"; // Импортируем PrivateRoute

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
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

function App() {
  return (
    <>
      <Header />

      <main className="main">
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
              {/* Страница авторизации */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Защищенные маршруты */}
              <Route
                path="/users"
                element={
                  <PrivateRoute>
                    <UsersPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/:userId"
                element={
                  <PrivateRoute>
                    <UserDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/edit/:userId"
                element={
                  <PrivateRoute>
                    <EditUserPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/add"
                element={
                  <PrivateRoute>
                    <AddUserPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/cars"
                element={
                  <PrivateRoute>
                    <CarsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/car/edit/:carId"
                element={
                  <PrivateRoute>
                    <EditCarPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/car/add/:userId"
                element={
                  <PrivateRoute>
                    <AddCarPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/address/:addressId"
                element={
                  <PrivateRoute>
                    <AddressDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/address/edit/:addressId"
                element={
                  <PrivateRoute>
                    <EditAddressPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/address/add/:userId"
                element={
                  <PrivateRoute>
                    <AddAddressPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/crime/edit/:crimeId"
                element={
                  <PrivateRoute>
                    <EditCrimePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/crime/add/:userId"
                element={
                  <PrivateRoute>
                    <AddCrimePage />
                  </PrivateRoute>
                }
              />

              {/* Переадресация на страницу авторизации по умолчанию */}
              <Route path="/" element={<Navigate to="/auth" replace />} />

              {/* Страница ошибок */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </Container>
      </main>
    </>
  );
}

export default App;
