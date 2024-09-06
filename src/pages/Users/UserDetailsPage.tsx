import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUserById, deleteUser } from "../../redux/userSlice";
import { RootState } from "../../redux/store";
import { Paper, Avatar, Grid, Button, Box } from "@mui/material";
import UserPaperSlider from "../../components/ui/UserPaperSlider";
import NoProfilePicture from "../../assets/noProfilePicture.webp";
import { Skeleton } from "@mui/material";
import ConfirmDeleteModal from "../../components/ui/modals/ConfirmDeleteUserModal";
import CarAccordion from "../../components/Accardions/CarAccordion";
import AddressAccordion from "../../components/Accardions/AddressAccordion";
import { getAllUsersPhones } from "../../redux/phoneSlice";

const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>(); // Отримуємо параметр userId з URL

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false); // модалка для підтвердження видалення

  const [isCarVisible, setIsCarVisible] = useState<boolean>(false);
  const [isAddressVisible, setIsAddressVisible] = useState<boolean>(false);

  const user = useAppSelector((state: RootState) =>
    state.user.users.find((u) => u.userID === userId)
  );

  const { loading, error } = useAppSelector((state: RootState) => state.user);

  const { phones } = useAppSelector((state: RootState) => state.phone);

  useEffect(() => {
    if (userId) {
      dispatch(getAllUsersPhones(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
      console.log("СРАБОТАЛА ФУНКЦИЯ getUserById");
    }
  }, [dispatch, userId]);

  if (!user) {
    return <div>User not found</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const showAllUsersCars = () => {
    setIsCarVisible(!isCarVisible);
  };

  const showAllUsersAdresses = () => {
    setIsAddressVisible(!isAddressVisible);
  };

  //======================

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
              Ім'я:
              {loading ? (
                <Skeleton
                  animation="wave"
                  width={50}
                  height={35}
                  variant="text"
                />
              ) : (
                <b>
                  {user.firstName} {user.lastName}
                </b>
              )}
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

            <br />

            {phones.length > 0 ? (
              <Box>
                <b>Телефони:</b>

                <ul>
                  {phones.map((phone) => (
                    <li key={phone.phoneID}>
                      <a href={`tel:${phone.phoneNumber}`}>
                        {phone.phoneNumber}
                      </a>
                    </li>
                  ))}
                </ul>
              </Box>
            ) : (
              <p>Телефонів немає</p>
            )}
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
          isCarVisible={isCarVisible}
          showAllUsersCars={showAllUsersCars}
        />

        <br />
        <AddressAccordion
          isAddressVisible={isAddressVisible}
          showAllUsersAdresses={showAllUsersAdresses}
        />
      </Paper>

      {openDeleteModal && user && (
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
