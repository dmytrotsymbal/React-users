import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { CriminalRecords } from "../../types/criminalRecordsTypes";
import {
  getAllPrisons,
  getCriminalRecordById,
  updateCriminalRecord,
} from "../../redux/criminalRecordSlice";
import { useNavigate, useParams } from "react-router-dom";
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
import CustomLoader from "../../components/ui/CustomLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomIconButton from "../../components/ui/CustomIconButton";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Валидация формы с использованием Yup
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

const EditCrimePage = () => {
  const { crimeId } = useParams<{ crimeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const criminalRecord = useAppSelector((state: RootState) =>
    state.crime.criminalRecords.find(
      (criminalRecord: CriminalRecords) =>
        criminalRecord.criminalRecordID === Number(crimeId)
    )
  );
  const { prisonsList, loading, error } = useAppSelector(
    (state: RootState) => state.crime
  );

  useEffect(() => {
    dispatch(getAllPrisons());
  }, [dispatch]);

  const memoizedCrime = useMemo(() => criminalRecord, [criminalRecord]);

  const initialValues = {
    criminalRecordID: memoizedCrime?.criminalRecordID || 0,
    userID: memoizedCrime?.userID || "",
    article: memoizedCrime?.article || "",
    convictionDate: memoizedCrime?.convictionDate
      ? new Date(memoizedCrime.convictionDate).toISOString().substring(0, 10)
      : "",
    releaseDate: memoizedCrime?.releaseDate
      ? new Date(memoizedCrime.releaseDate).toISOString().substring(0, 10)
      : "",
    sentence: memoizedCrime?.sentence || "",
    caseDetailsURL: memoizedCrime?.caseDetailsURL || "",
    details: memoizedCrime?.details || "",
    prisonID: memoizedCrime?.prison.prisonID || 0,
  };

  useEffect(() => {
    if (crimeId) {
      dispatch(getCriminalRecordById(Number(crimeId)));
    }
  }, [dispatch, crimeId]);

  const handleSubmit = async (values: typeof initialValues) => {
    if (crimeId && memoizedCrime) {
      const updatedCrime = {
        ...memoizedCrime,
        ...values,
      };
      await dispatch(
        updateCriminalRecord({
          criminalRecordID: Number(crimeId),
          criminalRecord: updatedCrime,
        })
      );
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

  if (!memoizedCrime) {
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
          Crime not found
        </Typography>
      </div>
    );
  }

  return (
    <>
      <br />
      <Paper style={{ padding: 16, position: "relative" }}>
        <Typography variant="h6">
          Редагувати кримінальний запис {crimeId}
        </Typography>

        <br />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, handleChange }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Criminal ID"
                    name="criminalRecordID"
                    value={values.criminalRecordID}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Article"
                    name="article"
                    helperText={<ErrorMessage name="article" />}
                    value={values.article}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Conviction Date"
                    name="convictionDate"
                    type="date"
                    value={values.convictionDate}
                    onChange={handleChange}
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
                    value={values.releaseDate}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="releaseDate" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Sentence"
                    name="sentence"
                    value={values.sentence}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="sentence" />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Case Details URL"
                    name="caseDetailsURL"
                    value={values.caseDetailsURL}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="caseDetailsURL" />}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="prison-label">Prison</InputLabel>
                    <Field
                      as={Select}
                      labelId="prison-label"
                      name="prisonID"
                      value={values.prisonID}
                      onChange={handleChange}
                    >
                      {prisonsList.map((prison) => (
                        <MenuItem key={prison.prisonID} value={prison.prisonID}>
                          {prison.prisonName}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                  <ErrorMessage name="prisonID" />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Details"
                    name="details"
                    value={values.details}
                    onChange={handleChange}
                    helperText={<ErrorMessage name="details" />}
                  />
                </Grid>
              </Grid>

              <br />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
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
    </>
  );
};

export default EditCrimePage;
