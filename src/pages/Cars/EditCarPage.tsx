import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useEffect, useMemo } from "react";
import { getCarById, updateCar } from "../../redux/carSlice";
import {
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Валідація форми за допомогою Yup
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

const EditCarPage = () => {
  const { carId } = useParams<{ carId: string }>(); // Отримуємо параметр carId з URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const car = useAppSelector((state: RootState) =>
    state.car.cars.find((c) => c.carID === Number(carId))
  );

  const loading = useAppSelector((state: RootState) => state.car.loading);
  const error = useAppSelector((state: RootState) => state.car.error);

  // Використовуємо useMemo для запам'ятовування даних автомобіля, щоб уникнути зайвих рендерів
  const memoizedCar = useMemo(() => car, [car]);

  // викликаємо метод для отримання автомобіля по айді і передаємо в параметр carId який отримали з URL
  useEffect(() => {
    if (carId) {
      dispatch(getCarById(Number(carId)));
    }
  }, [dispatch, carId]);

  // Встановлюємо початкові значення форми, коли дані автомобіля змінюються
  const initialValues = {
    carID: memoizedCar?.carID || 0,
    firm: memoizedCar?.firm || "",
    model: memoizedCar?.model || "",
    color: memoizedCar?.color || "",
    year: memoizedCar?.year || 0,
    licensePlate: memoizedCar?.licensePlate || "",
    carPhotoURL: memoizedCar?.carPhotoURL || "",
  };

  // функція для обробки відправки форми
  const handleSubmit = async (values: typeof initialValues) => {
    if (carId && memoizedCar) {
      const updatedCar = {
        ...memoizedCar,
        ...values,
      };
      await dispatch(updateCar({ carID: Number(carId), car: updatedCar }));
      navigate(-1); // Переход на предыдущую страницу
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
        <CircularProgress />
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

  if (!memoizedCar) {
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
          Car not found
        </Typography>
      </div>
    );
  }

  return (
    <>
      <br />
      <Paper style={{ padding: 16 }}>
        <Typography variant="h6">Редагувати автомобіль</Typography>
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
                    label="Car ID"
                    name="carID"
                    value={values.carID}
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
              <Grid
                container
                spacing={2}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button variant="contained" color="success" type="submit">
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate(-1)} // Переход на предыдущую страницу
                >
                  Cancel
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </>
  );
};

export default EditCarPage;
