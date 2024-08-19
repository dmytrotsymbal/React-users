import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUserById, deleteUser } from "../../redux/userSlice";
import { getAllUsersCars } from "../../redux/carSlice";
import { RootState } from "../../redux/store";
import {
  Paper,
  Typography,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableContainer,
  Grid,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UserPaperSlider from "../../components/ui/UserPaperSlider";
import NoProfilePicture from "../../assets/noProfilePicture.webp";
import CustomLoader from "../../components/ui/CustomLoader";
import ConfirmDeleteModal from "../../components/ui/modals/ConfirmDeleteUserModal";
import CarAccordion from "../../components/CarAccordion";

const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>(); // Отримуємо параметр userId з URL

  const dispatch = useAppDispatch();

  const navigate = useNavigate(); // навгігатор для переходу на сторінку редагування

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false); // модалка для видалення

  const { cars, loading } = useAppSelector((state: RootState) => state.car);

  const user = useAppSelector(
    (
      state: RootState // отримуємо користувача зі стейту
    ) => state.user.users.find((u) => u.userID === userId)
  );

  // викликаємло метод для отримання користувача по айді і передаємо в параметр userId який отримали з URL
  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
      console.log("СРАБОТАЛА ФУНКЦИЯ getUserById");
    }
  }, [dispatch, userId]);

  // на статус лоадінг
  if (!user) {
    return (
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
    );
  }

  const showAllUsersCars = () => {
    dispatch(getAllUsersCars(user.userID));
    console.log("СРАБОТАЛА ФУНКЦИЯ showAllUsersCars");
  };

  return (
    <>
      <br />
      <Paper style={{ padding: 16 }}>
        <Grid container spacing={2} sx={{ height: "300px" }}>
          <Grid
            item
            xs={12}
            sm={3}
            md={3}
            lg={3}
            sx={{
              position: "relative",
            }}
          >
            {!user.photos?.length ? (
              <Avatar
                sx={{ width: 200, height: 200 }}
                alt="No profile image"
                src={NoProfilePicture}
              />
            ) : (
              <UserPaperSlider user={user} />
            )}
          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4}>
            <Typography variant="h6">
              Ім'я: {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="h6">Імейл: {user.email}</Typography>
            <Typography variant="h6">
              Дата народження:{" "}
              {new Date(user.dateOfBirth).toLocaleDateString("uk-UA")}
            </Typography>
            <Typography variant="h6">
              Запис створено:{" "}
              {new Date(user.createdAt).toLocaleString("uk-UA", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sm={5}
            md={5}
            lg={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "200px" }}
              onClick={() => navigate(`/user/edit/${user.userID}`)}
            >
              Редагувати профіль
            </Button>

            <Button
              variant="contained"
              color="error"
              sx={{ width: "200px" }}
              onClick={() => setOpenDeleteModal(true)}
            >
              Видалити профіль
            </Button>
          </Grid>
        </Grid>

        <br />
        <CarAccordion
          cars={cars}
          loading={loading}
          showAllUsersCars={showAllUsersCars}
        />

        <br />
        <Accordion>
          <AccordionSummary
            sx={{ backgroundColor: "#7FA1C3", color: "white !important" }}
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: "white !important",
                }}
              />
            }
          >
            <Typography>Нерухомість</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {/* {user.cars.map((car) => (
                  <TableRow key={car.carID}>
                    <TableCell>{car.make}</TableCell>
                    <TableCell>{car.model}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>{car.licensePlate}</TableCell>
                    <TableCell><Avatar alt={car.carPhotoURL} src={car.carPhotoURL} /></TableCell>
                  </TableRow>
                ))} */}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {openDeleteModal && (
        <ConfirmDeleteModal
          open={openDeleteModal}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={() => {
            dispatch(deleteUser(user.userID));
            navigate("/");
          }}
          user={user}
        />
      )}
    </>
  );
};

export default UserDetailsPage;
