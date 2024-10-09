import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { CriminalRecords } from "../../types/criminalRecordsTypes";
import {
  getCriminalRecordById,
  updateCriminalRecord,
} from "../../redux/criminalRecordSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import CustomLoader from "../../components/ui/CustomLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomIconButton from "../../components/ui/CustomIconButton";

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
  const { loading, error } = useAppSelector((state: RootState) => state.crime);

  const memoizedCrime = useMemo(() => criminalRecord, [criminalRecord]);

  // Локальное состояние для полей формы
  const [formValues, setFormValues] = useState({
    criminalRecordID: memoizedCrime?.criminalRecordID || 0,
    userID: memoizedCrime?.userID || "",
    article: memoizedCrime?.article || "",
    convictionDate: memoizedCrime?.convictionDate
      ? new Date(memoizedCrime.convictionDate).toISOString().substring(0, 10)
      : "",
    releaseDate: memoizedCrime?.releaseDate
      ? new Date(memoizedCrime.releaseDate).toISOString().substring(0, 10)
      : null,
    sentence: memoizedCrime?.sentence || "",
    caseDetailsURL: memoizedCrime?.caseDetailsURL || "",
    details: memoizedCrime?.details || "",
    prisonID: memoizedCrime?.prison.prisonID || 0,
  });

  useEffect(() => {
    if (crimeId) {
      dispatch(getCriminalRecordById(Number(crimeId)));
    }
  }, [dispatch, crimeId]);

  useEffect(() => {
    if (memoizedCrime) {
      setFormValues({
        criminalRecordID: memoizedCrime.criminalRecordID,
        userID: memoizedCrime.userID,
        article: memoizedCrime.article,
        convictionDate: memoizedCrime?.convictionDate
          ? new Date(memoizedCrime.convictionDate)
              .toISOString()
              .substring(0, 10)
          : "",
        releaseDate: memoizedCrime?.releaseDate
          ? new Date(memoizedCrime.releaseDate).toISOString().substring(0, 10)
          : "",
        sentence: memoizedCrime.sentence,
        caseDetailsURL: memoizedCrime.caseDetailsURL || "",
        details: memoizedCrime.details,
        prisonID: memoizedCrime.prison.prisonID,
      });
    }
  }, [memoizedCrime]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (crimeId && memoizedCrime) {
      const updatedCrime = {
        ...memoizedCrime,
        ...formValues,
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
    <Paper style={{ padding: 16, position: "relative" }}>
      <Typography variant="h6">
        Редагувати кримінальний запис {crimeId}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Criminal ID"
              name="criminalRecordID"
              value={formValues.criminalRecordID}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Article"
              name="article"
              value={formValues.article}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Conviction Date"
              name="convictionDate"
              type="date"
              // InputLabelProps={{ shrink: true }}
              value={formValues.convictionDate}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              // InputLabelProps={{ shrink: true }}
              value={formValues.releaseDate}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sentence"
              name="sentence"
              value={formValues.sentence}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Case Details URL"
              name="caseDetailsURL"
              value={formValues.caseDetailsURL}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Details"
              name="details"
              value={formValues.details}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Prison ID"
              name="prisonID"
              type="number"
              value={formValues.prisonID}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
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
      </form>
    </Paper>
  );
};

export default EditCrimePage;
