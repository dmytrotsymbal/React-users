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
import { CarSearchFilters } from "../../../types/carTypes";
import { useAppDispatch } from "../../../store/hooks";
import { searchCars } from "../../../store/carSlice";

const validationSchema = Yup.object({
  minYear: Yup.number()
    .nullable()
    .min(1970, "Стільки машини не їздять")
    .max(2025, "Ще немає таких машин"),
  maxYear: Yup.number()
    .nullable()
    .min(Yup.ref("maxYear"), "Рік до має бути більшим за рік від"),
  carColor: Yup.string().nullable(),
});

type Props = {
  isDropdownOpen: boolean;
  searchQuery: string;
};

const CustomSearchCarsDropdown = ({ isDropdownOpen, searchQuery }: Props) => {
  const dispatch = useAppDispatch();

  const onSearchWithFilters = (filters: CarSearchFilters) => {
    dispatch(searchCars({ searchQuery, ...filters }));
  };

  return (
    <Paper
      sx={{
        display: isDropdownOpen ? "flex" : "none",
        flexDirection: "column",
        width: "400px",
        position: "absolute",
        top: "225px",
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
          minYear: "",
          maxYear: "",
          carColor: "",
          onlyWithPhoto: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSearchWithFilters({
            minYear: values.minYear ? Number(values.minYear) : undefined,
            maxYear: values.maxYear ? Number(values.maxYear) : undefined,
            carColor: values.carColor || undefined,
            onlyWithPhoto: values.onlyWithPhoto,
          });
        }}
      >
        {({ values, errors, touched, handleReset }) => (
          <Form>
            <Field
              as={TextField}
              label="Рік від"
              name="minYear"
              type="number"
              fullWidth
              margin="dense"
              error={touched.minYear && Boolean(errors.minYear)}
              helperText={touched.minYear && errors.minYear}
            />

            <Field
              as={TextField}
              label="Рік до"
              name="maxYear"
              type="number"
              fullWidth
              margin="dense"
              error={touched.maxYear && Boolean(errors.maxYear)}
              helperText={touched.maxYear && errors.maxYear}
            />

            <Field
              as={TextField}
              label="Колір машины"
              name="carColor"
              type="text"
              fullWidth
              margin="dense"
              error={touched.carColor && Boolean(errors.carColor)}
              helperText={touched.carColor && errors.carColor}
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
              label="Тільки машини з фото"
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

export default CustomSearchCarsDropdown;
