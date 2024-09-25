import { Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const CustomNoCoordinatesBlock = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "1200px",
        height: "1200px",
        backgroundColor: "#ffcccb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
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
        Здається, що для цієї адреси немає координат
      </Typography>
    </Paper>
  );
};
export default CustomNoCoordinatesBlock;
