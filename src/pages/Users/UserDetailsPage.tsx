import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getUserById,
  deleteUser,
  addUserToSelectedList,
} from "../../store/userSlice";
import { RootState } from "../../store/store";
import { Paper, Avatar, Grid, Button, Box } from "@mui/material";
import UserPaperSlider from "../../components/ui/UserPaperSlider";
import NoProfilePicture from "../../assets/images/noProfilePicture.png";
import { Skeleton } from "@mui/material";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteUserModal";
import CarAccordion from "../../components/Accardions/CarAccordion";
import AddressAccordion from "../../components/Accardions/AddressAccordion";
import { getAllUsersPhones } from "../../store/phoneSlice";
import CustomErrorBlock from "../../components/ui/CustomErrorBlock";
import CustomIconButton from "../../components/ui/CustomIconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CrimesAccardion from "../../components/Accardions/CrimesAccardion";
import { User } from "../../types/userTypes";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "../../assets/emojis/data.json";
import { formatDateTime } from "../../utils/formatDateTime";

const UserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>(); // Отримуємо параметр userId з URL

  const selectedList = useAppSelector((state: RootState) => state.user); // масив вибраних юзерів для дізейбла кнопки

  const { staff } = useAppSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false); // модалка для підтвердження видалення

  const [isCarVisible, setIsCarVisible] = useState<boolean>(false);
  const [isAddressVisible, setIsAddressVisible] = useState<boolean>(false);
  const [isCrimesVisible, setIsCrimesVisible] = useState<boolean>(false);

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

  const showAllUsersCars = () => {
    setIsCarVisible(!isCarVisible);
  };

  const showAllUsersAdresses = () => {
    setIsAddressVisible(!isAddressVisible);
  };

  const showAllUsersCrimes = () => {
    setIsCrimesVisible(!isCrimesVisible);
  };

  return (
    <>
      <br />

      {error ? (
        <CustomErrorBlock />
      ) : (
        user && (
          <Paper
            sx={{ padding: "16px !important", position: "relative", mb: 2 }}
          >
            <Grid container spacing={2} sx={{ height: "300px", width: "100%" }}>
              <Grid item xs={12} sm={3} md={3} lg={3}>
                {!user.photos?.length ? (
                  <Avatar
                    sx={{ width: 250, height: 250 }}
                    alt="No profile image"
                    src={NoProfilePicture}
                  />
                ) : (
                  <UserPaperSlider user={user} loading={loading} />
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                {loading ? (
                  <Skeleton
                    variant="text"
                    width="200px"
                    height="35px"
                    animation="wave"
                  />
                ) : (
                  <p>
                    Ім'я:
                    <b>
                      {" "}
                      {user.firstName} {user.lastName}
                    </b>
                  </p>
                )}

                {loading ? (
                  <Skeleton
                    variant="text"
                    width="350px"
                    height="35px"
                    animation="wave"
                  />
                ) : (
                  <p>
                    Імейл: <a href={`mailto:${user.email}`}>{user.email}</a>
                  </p>
                )}

                {loading ? (
                  <Skeleton
                    variant="text"
                    width="250px"
                    height="35px"
                    animation="wave"
                  />
                ) : (
                  <p>
                    Дата народження:{" "}
                    {new Date(user.dateOfBirth).toLocaleDateString("uk-UA")}
                  </p>
                )}

                {loading ? (
                  <Skeleton
                    variant="text"
                    width="400px"
                    height="35px"
                    animation="wave"
                  />
                ) : (
                  <p>Запис створено: {formatDateTime(user.createdAt)}</p>
                )}

                <br />

                {phones.length > 0 ? (
                  <Box>
                    <b>Телефони:</b>

                    {loading ? (
                      <>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            variant="text"
                            width="150px"
                            height="35px"
                            animation="wave"
                            sx={{
                              ml: "40px",
                            }}
                          />
                        ))}
                      </>
                    ) : (
                      <ul>
                        {phones.map((phone) => (
                          <li key={phone.phoneID}>
                            <a href={`tel:${phone.phoneNumber}`}>
                              {phone.phoneNumber}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <p style={{ marginRight: "10px" }}>Телефонів немає</p>

                    <EmojiProvider data={emojiData}>
                      <Emoji name="pensive-face" width={24} />
                    </EmojiProvider>
                  </Box>
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
                  sx={{ width: "220px" }}
                  onClick={() => navigate(`/user/edit/${user.userID}`)}
                >
                  Редагувати профіль
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  sx={{ width: "220px" }}
                  onClick={() => setOpenDeleteModal(true)}
                  disabled={staff?.role !== "admin"}
                >
                  Видалити профіль
                </Button>

                <Button
                  disabled={selectedList.selectedUsers.some(
                    (selectedUser: User) => selectedUser.userID === user.userID
                  )}
                  variant="contained"
                  color="success"
                  sx={{ width: "220px" }}
                  onClick={() => dispatch(addUserToSelectedList(user))}
                >
                  Додати в закладки
                </Button>

                <CustomIconButton
                  icon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                />
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

            <br />
            <CrimesAccardion
              isCrimesVisible={isCrimesVisible}
              showAllUsersCrimes={showAllUsersCrimes}
            />
          </Paper>
        )
      )}

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
