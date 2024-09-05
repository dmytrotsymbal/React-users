import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useEffect, useMemo } from "react";
import { getUserAddressByID, updateAddress } from "../../redux/addressSlice";
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

// Валидация формы с помощью Yup
const validationSchema = Yup.object({
  streetAddress: Yup.string()
    .max(100, "Street address must be at most 100 characters")
    .required("Street address is required"),
  city: Yup.string()
    .max(50, "City must be at most 50 characters")
    .required("City is required"),
  state: Yup.string()
    .max(2, "State must be a valid 2-letter code")
    .required("State is required"),
  postalCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, "Invalid postal code")
    .required("Postal code is required"),
  country: Yup.string()
    .max(50, "Country must be at most 50 characters")
    .required("Country is required"),
});

const EditAddressPage = () => {
  const { addressId } = useParams<{ addressId: string }>(); // Получаем addressId из URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const address = useAppSelector((state: RootState) =>
    state.address.addresses.find((a) => a.addressID === Number(addressId))
  );

  const loading = useAppSelector((state: RootState) => state.address.loading);
  const error = useAppSelector((state: RootState) => state.address.error);

  // Используем useMemo для мемоизации данных адреса
  const memoizedAddress = useMemo(() => address, [address]);

  // Получаем адрес по ID при загрузке страницы
  useEffect(() => {
    if (addressId) {
      dispatch(getUserAddressByID(Number(addressId)));
    }
  }, [dispatch, addressId]);

  // Начальные значения формы
  const initialValues = {
    addressID: memoizedAddress?.addressID || 0,
    streetAddress: memoizedAddress?.streetAddress || "",
    city: memoizedAddress?.city || "",
    state: memoizedAddress?.state || "",
    postalCode: memoizedAddress?.postalCode || "",
    country: memoizedAddress?.country || "",
  };

  // Функция обработки отправки формы
  const handleSubmit = async (values: typeof initialValues) => {
    if (addressId && memoizedAddress) {
      const updatedAddress = {
        ...memoizedAddress,
        ...values,
      };
      await dispatch(
        updateAddress({ addressID: Number(addressId), address: updatedAddress })
      );
      navigate(-1); // Переход на предыдущую страницу
    }
  };

  // Рендерим спиннер при загрузке
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

  // Рендерим ошибку, если есть
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

  // Если адрес не найден, рендерим сообщение об ошибке
  if (!memoizedAddress) {
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
          Address not found
        </Typography>
      </div>
    );
  }

  return (
    <>
      <br />
      <Paper style={{ padding: 16 }}>
        <Typography variant="h6">Редагувати адресу</Typography>
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
                    label="Address ID"
                    name="addressID"
                    value={values.addressID}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Street Address"
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
                    label="Postal Code"
                    name="postalCode"
                    helperText={<ErrorMessage name="postalCode" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Country"
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

export default EditAddressPage;
