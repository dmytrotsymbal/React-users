import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { addAddressToUser } from "../../redux/addressSlice";
import { Button, TextField, Paper, Grid, Typography } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Address } from "../../types/addressTypes";

// Валидация формы с помощью Yup
const validationSchema = Yup.object({
  streetAddress: Yup.string()
    .max(100, "Street address must be at most 100 characters")
    .required("Street address is required"),

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
});

const AddAddressPage = () => {
  const { userId } = useParams<{ userId: string }>(); // Получаем параметр userId из URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Начальные значения формы
  const initialValues = {
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  };

  // Функция для обработки отправки формы
  const handleSubmit = async (values: typeof initialValues) => {
    if (userId) {
      const address: Address = {
        ...values,
        addressID: 0, // Add carID property with the correct type
        userID: userId, // Add userID property
      };
      await dispatch(addAddressToUser({ userID: userId, address }));
      navigate(-1); // Переход на предыдущую страницу
    }
  };

  return (
    <>
      <br />
      <Paper style={{ padding: 16 }}>
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
                  onClick={() => navigate(-1)}
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

export default AddAddressPage;
