import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const ErrorPage = () => {
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
        404 - Сторінку не знайдено
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        На жаль, ми не можемо знайти сторінку, яку ви шукаєте.
      </Typography>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button type="button" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Повернутися на головну
        </Button>
      </Link>
    </Box>
  );
};
export default ErrorPage;
