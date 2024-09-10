import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useEffect, useMemo, useState } from "react";
import { getUserById, updateUser } from "../../redux/userSlice";
import { deletePhoto, addPhoto } from "../../redux/photoSlice";
import AddPhotoModal from "../../components/ui/modals/AddPhotoModal";
import { Photo } from "../../types/photoTypes";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ConfirmDeletePhotoModal from "../../components/ui/modals/ConfirmDeletePhotoModal";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomLoader from "../../components/ui/CustomLoader";
import CustomIconButton from "../../components/ui/CustomIconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Валідація форми за допомогою Yup
const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(
      /^[A-Z][a-zA-Z]*$/,
      "First Name must start with an uppercase letter and contain only Latin letters"
    )
    .max(40, "First Name must be at most 40 characters")
    .required("First Name is required"),
  lastName: Yup.string()
    .matches(
      /^[A-Z][a-zA-Z]*$/,
      "Last Name must start with an uppercase letter and contain only Latin letters"
    )
    .max(40, "Last Name must be at most 40 characters")
    .required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .max(55, "Email must be at most 55 characters")
    .required("Email is required"),
  dateOfBirth: Yup.string().required("Date of Birth is required"),
  photos: Yup.array().of(
    Yup.object({
      imageURL: Yup.string()
        .url("Invalid URL format")
        .max(200, "Image URL must be at most 200 characters")
        .required("Image URL is required"),
    })
  ),
});

const EditUserPage = () => {
  const { userId } = useParams<{ userId: string }>(); // Отримуємо параметр userId з URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [openAddPhotoModal, setOpenAddPhotoModal] = useState<boolean>(false); // модалка для додавання фото
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false); // модалка для підтвердження видалення

  // стейт для відстеження вибраної фотографії для видалення або редагування
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const user = useAppSelector(
    (
      state: RootState // Отримуємо користувача зі стейту
    ) => state.user.users.find((u) => u.userID === userId)
  );

  const { loading, error } = useAppSelector((state: RootState) => state.user); // Отримуємо статус загрузки та помилку

  // Використовуємо useMemo для запам'ятовування даних користувача, щоб уникнути зайвих рендерів
  const memoizedUser = useMemo(() => user, [user]);

  // викликаємло метод для отримання користувача по айді і передаємо в параметр userId який отримали з URL
  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  // Встановлюємо початкові значення форми, коли дані користувача змінюються
  const initialValues = {
    userID: memoizedUser?.userID || "",
    firstName: memoizedUser?.firstName || "",
    lastName: memoizedUser?.lastName || "",
    email: memoizedUser?.email || "",
    dateOfBirth: memoizedUser
      ? new Date(memoizedUser.dateOfBirth).toISOString().substring(0, 10)
      : "",
    photos: memoizedUser?.photos || [],
  };

  // функція для обробки відправки форми
  const handleSubmit = async (values: typeof initialValues) => {
    if (userId && memoizedUser) {
      const updatedUser = {
        ...memoizedUser,
        ...values,
      };
      await dispatch(updateUser({ userID: userId, user: updatedUser }));
      navigate(`/user/${userId}`);
    }
  };

  // Обробка додавання фотографії
  const handleAddPhoto = async (photo: Omit<Photo, "imageID">) => {
    if (userId) {
      await dispatch(addPhoto({ userID: userId, photo }));
      dispatch(getUserById(userId));
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  if (!memoizedUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          User not found
        </Typography>
      </div>
    );
  }

  return (
    <>
      <br />
      <Paper style={{ padding: 16, position: "relative" }}>
        <Typography variant="h6">Редагувати користувача</Typography>
        <br />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="User ID"
                    name="userID"
                    value={values.userID}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="First Name"
                    name="firstName"
                    helperText={<ErrorMessage name="firstName" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    helperText={<ErrorMessage name="lastName" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Email"
                    name="email"
                    helperText={<ErrorMessage name="email" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    helperText={<ErrorMessage name="dateOfBirth" />}
                  />
                </Grid>
              </Grid>

              <br />
              <hr />

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <Typography variant="h6">Фотографії користувача :</Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenAddPhotoModal(true)}
                >
                  Додати фото
                </Button>
              </Box>
              <Grid container spacing={2}>
                {values.photos.length > 0 && (
                  <Grid item xs={12}>
                    {values.photos.map((photo, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid item xs={5.5}>
                          <Field
                            as={TextField}
                            sx={{ mt: 2 }}
                            fullWidth
                            label="Image URL"
                            name={`photos.${index}.imageURL`}
                            type="url"
                          />
                          <ErrorMessage
                            name={`photos.${index}.imageURL`}
                            component="div"
                          />
                        </Grid>
                        <Grid item xs={5.5}>
                          <Field
                            as={TextField}
                            sx={{ mt: 2 }}
                            fullWidth
                            label="Alt Text"
                            name={`photos.${index}.altText`}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            sx={{ mt: 2 }}
                            onClick={() => {
                              setSelectedPhoto(photo);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <DeleteForeverIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>

              <br />
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Button variant="contained" color="success" type="submit">
                  Зберегти
                </Button>

                <Button type="reset" variant="contained" color="inherit">
                  Скинути
                </Button>

                <CustomIconButton
                  icon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
      <AddPhotoModal
        userId={userId}
        open={openAddPhotoModal}
        onClose={() => setOpenAddPhotoModal(false)}
        onAdd={handleAddPhoto}
      />

      {openDeleteModal && selectedPhoto && (
        <ConfirmDeletePhotoModal
          open={openDeleteModal}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={() => {
            dispatch(deletePhoto(selectedPhoto.imageID.toString()));
            setOpenDeleteModal(false);
            navigate(`/user/${userId}`);
          }}
          photo={selectedPhoto}
        />
      )}
    </>
  );
};

export default EditUserPage;
