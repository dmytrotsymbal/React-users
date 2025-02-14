import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { UserSearchFilters } from "../../../types/userTypes";
import { searchUsersByName } from "../../../store/userSlice";
import { useAppDispatch } from "../../../store/hooks";

const validationSchema = Yup.object({
  minAge: Yup.number()
    .nullable()
    .min(0, "Мінімальний вік не може бути менше 0")
    .max(109, "Вік занадто великий"),
  maxAge: Yup.number()
    .nullable()
    .min(Yup.ref("minAge"), "Максимальний вік має бути більшим за мінімальний"),
  createdFrom: Yup.date().nullable(),
  createdTo: Yup.date()
    .nullable()
    .min(Yup.ref("createdFrom"), "Дата до має бути пізнішою за дату від"),
});

type Props = {
  isDropdownOpen: boolean;
  searchQuery: string;
};

const CustomSearchUsersDropdown = ({ isDropdownOpen, searchQuery }: Props) => {
  const dispatch = useAppDispatch();

  const onSearchWithFilters = (filters: UserSearchFilters) => {
    dispatch(searchUsersByName({ searchQuery, ...filters }));
  };

  return (
    <Paper
      sx={{
        display: isDropdownOpen ? "flex" : "none",
        flexDirection: "column",
        width: "500px",
        position: "absolute",
        top: "143px",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        padding: "16px",
        backgroundColor: "white",
        border: "1px solid #ccc",
      }}
    >
      <Formik
        initialValues={{
          minAge: "",
          maxAge: "",
          createdFrom: "",
          createdTo: "",
          onlyAdults: false,
          onlyWithPhoto: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSearchWithFilters({
            minAge: values.minAge ? Number(values.minAge) : undefined,
            maxAge: values.maxAge ? Number(values.maxAge) : undefined,
            createdFrom: values.createdFrom || undefined,
            createdTo: values.createdTo || undefined,
            onlyAdults: values.onlyAdults,
            onlyWithPhoto: values.onlyWithPhoto,
          });
        }}
      >
        {({ values, errors, touched, handleReset }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Field
                  as={TextField}
                  label="Мінімальний вік"
                  name="minAge"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={touched.minAge && Boolean(errors.minAge)}
                  helperText={touched.minAge && errors.minAge}
                />

                <Field
                  as={TextField}
                  label="Дата створення (від)"
                  name="createdFrom"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                  error={touched.createdFrom && Boolean(errors.createdFrom)}
                  helperText={touched.createdFrom && errors.createdFrom}
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  as={TextField}
                  label="Максимальний вік"
                  name="maxAge"
                  type="number"
                  fullWidth
                  margin="dense"
                  error={touched.maxAge && Boolean(errors.maxAge)}
                  helperText={touched.maxAge && errors.maxAge}
                />
                <Field
                  as={TextField}
                  label="Дата створення (до)"
                  name="createdTo"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                  error={touched.createdTo && Boolean(errors.createdTo)}
                  helperText={touched.createdTo && errors.createdTo}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Field
                  as={Checkbox}
                  type="checkbox"
                  name="onlyAdults"
                  checked={values.onlyAdults}
                />
              }
              label="Тільки повнолітні особи"
            />

            <FormControlLabel
              control={
                <Field
                  as={Checkbox}
                  type="checkbox"
                  name="onlyWithPhoto"
                  checked={values.onlyWithPhoto}
                />
              }
              label="Тільки особи з фото"
            />
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Застосувати
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="small"
                  type="button"
                  variant="contained"
                  color="inherit"
                  fullWidth
                  onClick={handleReset}
                >
                  Скинути
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default CustomSearchUsersDropdown;
