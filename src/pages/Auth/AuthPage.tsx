import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { LoginDTO } from "../../types/staffTypes";
import { login } from "../../redux/authSlice";
import CustomLoader from "../../components/ui/CustomLoader";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { loading, error, isLoggedIn } = useAppSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginData: LoginDTO = { email, password };
    dispatch(login(loginData));
  };

  if (isLoggedIn) {
    navigate("/users");
  }
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
        onSubmit={handleSubmit}
      >
        <Typography variant="h4">Вхід</Typography>

        <TextField
          label="Електронна пошта"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {loading && <CustomLoader />}

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
