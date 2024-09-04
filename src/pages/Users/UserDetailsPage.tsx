import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUserById, deleteUser } from "../../redux/userSlice";
import { getAllUsersCars } from "../../redux/carSlice";
import { RootState } from "../../redux/store";
import { Paper, Avatar, Grid, Button } from "@mui/material";
import UserPaperSlider from "../../components/ui/UserPaperSlider";
import NoProfilePicture from "../../assets/noProfilePicture.webp";
import CustomLoader from "../../components/ui/CustomLoader";
import ConfirmDeleteModal from "../../components/ui/modals/ConfirmDeleteUserModal";
import CarAccordion from "../../components/CarAccordion";
import AddressAccordion from "../../components/AddressAccordion";

const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>(); // Отримуємо параметр userId з URL

  const dispatch = useAppDispatch();

  const navigate = useNavigate(); // навгігатор для переходу на сторінку редагування

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false); // модалка для видалення

  const [isAddressVisible, setIsAddressVisible] = useState<boolean>(false);

  const { cars, loading, error } = useAppSelector(
    (state: RootState) => state.car
  );

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

  const showAllUsersAdresses = () => {
    setIsAddressVisible(!isAddressVisible);
  };

  return (
    <>
      <br />
      <Paper sx={{ padding: "16px !important" }}>
        <Grid container spacing={2} sx={{ height: "300px", width: "100%" }}>
          <Grid item xs={12} sm={3} md={3} lg={3}>
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

          <Grid item xs={12} sm={6} md={6} lg={6}>
            <p>
              Ім'я:{" "}
              <b>
                {user.firstName} {user.lastName}
              </b>
            </p>

            <p>
              Імейл: <a href={`mailto:${user.email}`}>{user.email}</a>
            </p>
            <p>
              Дата народження:{" "}
              {new Date(user.dateOfBirth).toLocaleDateString("uk-UA")}
            </p>
            <p>
              Запис створено:{" "}
              {new Date(user.createdAt).toLocaleString("uk-UA", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </Grid>

          <Grid
            item
            xs={12}
            sm={3}
            md={3}
            lg={3}
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
          error={error}
          showAllUsersCars={showAllUsersCars}
        />

        <br />
        <AddressAccordion
          isAddressVisible={isAddressVisible}
          showAllUsersAdresses={showAllUsersAdresses}
        />
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
