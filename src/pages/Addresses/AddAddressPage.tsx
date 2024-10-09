import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { addAddressToUser } from "../../redux/addressSlice";
import { Button, TextField, Paper, Grid, Typography, Box } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Address } from "../../types/addressTypes";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomIconButton from "../../components/ui/CustomIconButton";

// Валидация формы с помощью Yup
const validationSchema = Yup.object({
  streetAddress: Yup.string()
    .max(100, "Street address must be at most 100 characters")
    .required("Street address is required"),
  houseNumber: Yup.number()
    .min(11, "House number must be at most 11 characters")
    .typeError("House number must be a number")
    .integer("House number must be an integer")
    .required("House number is required"),
  apartmentNumber: Yup.number()
    .min(11, "House number must be at most 11 characters")
    .typeError("House number must be a number")
    .integer("House number must be an integer")
    .required("House number is required"),
  city: Yup.string()
    .max(50, "City must be at most 50 characters")
    .matches(/^[^\d]*$/, "City cannot contain numbers")
    .required("City is required"),
  state: Yup.string()
    .max(2, "State must be a valid 2-letter code")
    .matches(/^[^\d]*$/, "State cannot contain numbers")
    .required("State is required"),
  postalCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, "Invalid postal code")
    .required("Postal code is required"),
  country: Yup.string()
    .max(50, "Country must be at most 50 characters")
    .matches(/^[^\d]*$/, "Country cannot contain numbers")
    .required("Country is required"),
  latitude: Yup.number()
    .typeError("Latitude must be a number")
    .required("Latitude is required"),
  longitude: Yup.number()
    .typeError("Longitude must be a number")
    .required("Longitude is required"),
  moveInDate: Yup.string().required("Move in date is required"),
  moveOutDate: Yup.date()
    .nullable()
    .typeError("Move out date must be a valid date"),
});

const AddAddressPage = () => {
  const { userId } = useParams<{ userId: string }>(); // Получаем параметр userId из URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Начальные значения формы
  const initialValues = {
    streetAddress: "",
    houseNumber: 0,
    apartmentNumber: 0,
    city: "",
    state: "",
    postalCode: "",
    country: "",
    latitude: 0,
    longitude: 0,
    moveInDate: "",
    moveOutDate: "" as string | null,
  };

  // Функция для обработки отправки формы
  const handleSubmit = async (values: typeof initialValues) => {
    if (userId) {
      const address: Address = {
        ...values,
        addressID: 0,
        userID: userId,
        moveOutDate: values.moveOutDate || null,
      };
      await dispatch(addAddressToUser({ userID: userId, address }));
      navigate(-1);
    }
  };

  return (
    <>
      <br />
      <Paper style={{ padding: 16, position: "relative" }}>
        <Typography variant="h6">Додати адресу</Typography>
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
                    label="Street address"
                    name="streetAddress"
                    helperText={<ErrorMessage name="streetAddress" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="House number"
                    name="houseNumber"
                    helperText={<ErrorMessage name="houseNumber" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Apartment number"
                    name="apartmentNumber"
                    helperText={<ErrorMessage name="apartmentNumber" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="City"
                    name="city"
                    helperText={<ErrorMessage name="city" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="State"
                    name="state"
                    helperText={<ErrorMessage name="state" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="postalCode"
                    name="postalCode"
                    helperText={<ErrorMessage name="postalCode" />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="country"
                    name="country"
                    helperText={<ErrorMessage name="country" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Latitude"
                    name="latitude"
                    helperText={<ErrorMessage name="latitude" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    helperText={<ErrorMessage name="longitude" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Move In Date"
                    name="moveInDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    helperText={<ErrorMessage name="moveInDate" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Move Out Date"
                    name="moveOutDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    helperText={<ErrorMessage name="moveOutDate" />}
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

export default AddAddressPage;
