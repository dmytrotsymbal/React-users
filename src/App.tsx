import { Container } from "@mui/material";
import Header from "./components/Header";
import "./styles/App.css";
import "./styles/font.css";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import CustomLoader from "./components/ui/CustomLoader";
import ScrollToTop from "./utils/scrollToTop";

const UsersPage = lazy(() => import("./pages/Users/UsersPage"));
const UsersDetailsPage = lazy(() => import("./pages/Users/UserDetailsPage"));
const EditUserPage = lazy(() => import("./pages/Users/EditUserPage"));
const AddUserPage = lazy(() => import("./pages/Users/AddUserPage"));

//===================
const CarsPage = lazy(() => import("./pages/Cars/CarsPage"));
const EditCarPage = lazy(() => import("./pages/Cars/EditCarPage"));
const AddCarPage = lazy(() => import("./pages/Cars/AddCarPage"));

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
              <Route path="/" element={<UsersPage />} />
              <Route path="user/:userId" element={<UsersDetailsPage />} />
              <Route path="user/edit/:userId" element={<EditUserPage />} />
              <Route path="user/add" element={<AddUserPage />} />

              <Route path="/cars" element={<CarsPage />} />
              <Route path="car/edit/:carId" element={<EditCarPage />} />
              <Route path="car/add/:userId" element={<AddCarPage />} />
            </Routes>
          </Suspense>
        </Container>
      </main>
    </>
  );
}

export default App;
