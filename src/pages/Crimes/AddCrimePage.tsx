import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { CriminalRecords } from "../../types/criminalRecordsTypes";
import {
  addCriminalRecordToUser,
  getAllPrisons,
} from "../../redux/criminalRecordSlice";
import * as Yup from "yup";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import CustomIconButton from "../../components/ui/CustomIconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const validationSchema = Yup.object().shape({
  article: Yup.string()
    .required("Article is required")
    .max(100, "Article cannot be longer than 100 characters"),
  convictionDate: Yup.date().required("Conviction date is required"),
  releaseDate: Yup.date().nullable().notRequired(),
  sentence: Yup.string().required("Sentence is required"),
  caseDetailsURL: Yup.string().url("Invalid URL format").nullable(),
  details: Yup.string().required("Details are required"),
  prisonID: Yup.number().required("Prison is required"),
});

const AddCrimePage = () => {
  const { userId } = useParams<{ userId: string }>(); // Получаем параметр userId из URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues = {
    article: "",
    convictionDate: "",
    releaseDate: "",
    sentence: "",
    caseDetailsURL: "",
    details: "",
    prisonID: 0,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (userId) {
      const crime: CriminalRecords = {
        ...values,
        releaseDate: values.releaseDate || null,
        convictionDate: values.convictionDate,
        criminalRecordID: 0,
        userID: userId,
        prison: {
          prisonID: values.prisonID,
          prisonName: "",
          location: "",
          capacity: 0,
        }, // Add the prison property with the corresponding ID
      };
      await dispatch(
        addCriminalRecordToUser({ userID: userId, criminalRecord: crime })
      );
      navigate(-1);
    }
  };

  const { prisonsList } = useAppSelector((state: RootState) => state.crime);

  useEffect(() => {
    dispatch(getAllPrisons());
  }, [dispatch]);
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
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Conviction Date"
                    name="convictionDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    helperText={<ErrorMessage name="convictionDate" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Release Date"
                    name="releaseDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    helperText={<ErrorMessage name="releaseDate" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Article"
                    name="article"
                    helperText={<ErrorMessage name="article" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="sentence"
                    name="sentence"
                    helperText={<ErrorMessage name="sentence" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="caseDetailsURL"
                    name="caseDetailsURL"
                    helperText={<ErrorMessage name="caseDetailsURL" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="prison-label">Prison</InputLabel>
                    <Field as={Select} labelId="prison-label" name="prisonID">
                      {prisonsList.map((prison) => (
                        <MenuItem key={prison.prisonID} value={prison.prisonID}>
                          {prison.prisonName}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="details"
                    name="details"
                    helperText={<ErrorMessage name="details" />}
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
export default AddCrimePage;
