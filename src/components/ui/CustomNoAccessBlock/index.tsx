import { Typography, Box, Button, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const CustomNoAccessBlock = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        pt: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5" color="text.primary" gutterBottom>
        403 - Доступ заборонений
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        На жаль, ви не маєте доступу до цієї сторінки.
      </Typography>

      <Link to="/" style={{ textDecoration: "none" }}>
        <Grid container spacing={1} sx={{ mt: 3, mb: 2 }}>
          <Grid item xs={6}>
            <Button
              type="button"
              variant="contained"
              color="success"
              sx={{ width: "200px" }}
            >
              На головну
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              onClick={() => navigate(-1)}
              type="button"
              variant="contained"
              color="inherit"
              sx={{ width: "200px" }}
            >
              На попередню
            </Button>
          </Grid>
        </Grid>
      </Link>
    </Box>
  );
};
export default CustomNoAccessBlock;
