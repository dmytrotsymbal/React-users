import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useEffect, useMemo } from "react";
import { getUserAddressByID, updateAddress } from "../../redux/addressSlice";
import { Button, TextField, Paper, Grid, Typography, Box } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomLoader from "../../components/ui/CustomLoader";
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
    .min(11, "Apartment number must be at most 11 characters")
    .typeError("Apartment number must be a number")
    .integer("Apartment number must be an integer")
    .required("Apartment number is required"),
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
  moveInDate: Yup.date().required("Move in date is required"),
  moveOutDate: Yup.date()
    .nullable()
    .typeError("Move out date must be a valid date"),
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

  useEffect(() => {
    if (addressId) {
      dispatch(
        getUserAddressByID({
          userID: address?.userID,
          addressID: Number(addressId),
        })
      );
    }
  }, [dispatch, address?.userID, addressId]);

  // Начальные значения формы
  const initialValues = {
    addressID: memoizedAddress?.addressID || 0,
    streetAddress: memoizedAddress?.streetAddress || "",
    houseNumber: memoizedAddress?.houseNumber || 0,
    apartmentNumber: memoizedAddress?.apartmentNumber || 0,
    city: memoizedAddress?.city || "",
    state: memoizedAddress?.state || "",
    postalCode: memoizedAddress?.postalCode || "",
    country: memoizedAddress?.country || "",
    latitude: memoizedAddress?.latitude || 0,
    longitude: memoizedAddress?.longitude || 0,
    moveInDate: memoizedAddress
      ? new Date(memoizedAddress.moveInDate).toISOString().substring(0, 10)
      : "",
    moveOutDate: memoizedAddress?.moveOutDate
      ? new Date(memoizedAddress.moveOutDate).toISOString().substring(0, 10)
      : null,
  };

  // Функция обработки отправки формы
  const handleSubmit = async (values: typeof initialValues) => {
    if (addressId && memoizedAddress) {
      const updatedAddress = {
        ...memoizedAddress,
        ...values,
        moveOutDate: values.moveOutDate || null,
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
        <CustomLoader />
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
      <Paper style={{ padding: 16, position: "relative" }}>
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
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="House Number"
                    name="houseNumber"
                    helperText={<ErrorMessage name="houseNumber" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Apartment Number"
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
                    helperText={<ErrorMessage name="moveInDate" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    value={values.moveOutDate || ""} // Если null, то пустая строка
                    label="Move Out Date"
                    name="moveOutDate"
                    type="date"
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

export default EditAddressPage;
