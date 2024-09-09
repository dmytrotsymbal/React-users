import { Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CustomErrorBlock = () => {
  const reloadPage = () => {
    window.location.reload();
  };
  return (
    <Paper
      elevation={3}
      sx={{ padding: "82px", textAlign: "center", backgroundColor: "#ffcccb" }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: "72px" }} />
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: "16px", color: "red" }}
      >
        Ууупс... Щось пішло не так!
      </Typography>
      <Typography sx={{ color: "grey.700" }}>
        Маємо деякі проблеми з підключенням до бази даних.
      </Typography>
      <Button
        onClick={reloadPage}
        variant="contained"
        color="primary"
        sx={{ marginTop: "24px" }}
      >
        Спробувати знову
      </Button>
    </Paper>
  );
};

export default CustomErrorBlock;
