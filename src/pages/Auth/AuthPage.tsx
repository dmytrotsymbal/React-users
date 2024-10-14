import { TextField, Button, Box, Typography } from "@mui/material";

const AuthPage = () => {
  return (
    <>
      <br />

      <br />
      <form
        style={{
          margin: "auto",
          padding: "25px",
          borderRadius: 5,
          width: 500,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4">Вхід</Typography>

        <TextField
          label="Електронна пошта"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
        />

        <br />
        <br />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="success" type="submit">
            Увійти
          </Button>
          <Button variant="contained" color="inherit" type="reset">
            Скинути
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AuthPage;
