import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { addCarToUser } from "../../redux/carSlice";
import { Button, TextField, Paper, Grid, Typography, Box } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Car } from "../../types/carTypes";
import CustomIconButton from "../../components/ui/CustomIconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Валидация формы с помощью Yup
const validationSchema = Yup.object({
  firm: Yup.string()
    .max(40, "Firm must be at most 40 characters")
    .required("Firm is required"),
  model: Yup.string()
    .max(40, "Model must be at most 40 characters")
    .required("Model is required"),
  color: Yup.string()
    .max(20, "Color must be at most 20 characters")
    .required("Color is required"),
  year: Yup.number()
    .min(1886, "Year must be at least 1886")
    .max(
      new Date().getFullYear(),
      `Year must be at most ${new Date().getFullYear()}`
    )
    .required("Year is required"),
  licensePlate: Yup.string()
    .max(10, "License Plate must be at most 10 characters")
    .required("License Plate is required"),
  carPhotoURL: Yup.string()
    .url("Invalid URL format")
    .max(200, "Image URL must be at most 200 characters")
    .required("Image URL is required"),
});

const AddCarPage = () => {
  const { userId } = useParams<{ userId: string }>(); // Получаем параметр userId из URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Начальные значения формы
  const initialValues = {
    firm: "",
    model: "",
    color: "",
    year: 0,
    licensePlate: "",
    carPhotoURL: "",
  };

  // Функция для обработки отправки формы
  const handleSubmit = async (values: typeof initialValues) => {
    if (userId) {
      const car: Car = {
        ...values,
        year: Number(values.year), // Преобразуем год в число
        carID: 0, // Add carID property with the correct type
        userID: userId, // Add userID property
      };
      await dispatch(addCarToUser({ userID: userId, car }));
      navigate(-1); // Переход на предыдущую страницу
    }
  };

  return (
    <>
      <br />
      <Paper style={{ padding: 16, position: "relative" }}>
        <Typography variant="h6">Додати автомобіль</Typography>
        <br />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="User ID"
                    value={userId}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Firm"
                    name="firm"
                    helperText={<ErrorMessage name="firm" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Model"
                    name="model"
                    helperText={<ErrorMessage name="model" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Color"
                    name="color"
                    helperText={<ErrorMessage name="color" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Year"
                    name="year"
                    type="number"
                    helperText={<ErrorMessage name="year" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="License Plate"
                    name="licensePlate"
                    helperText={<ErrorMessage name="licensePlate" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Car Photo URL"
                    name="carPhotoURL"
                    helperText={<ErrorMessage name="carPhotoURL" />}
                  />
                </Grid>
              </Grid>

              <br />
              <Box style={{ display: "flex", justifyContent: "space-between" }}>
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
    </>
  );
};

export default AddCarPage;
