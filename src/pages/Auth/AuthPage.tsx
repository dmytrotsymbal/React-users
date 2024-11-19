import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { login } from "../../redux/authSlice";
import CustomLoader from "../../components/ui/CustomLoader";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "../../components/ui/CustomTooltip";
import CustomSnackbar from "../../components/ui/CustomSnackbar";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Невірний формат email")
    .matches(/^[a-zA-Z0-9@.]+$/, "Лише латиниця")
    .required("Email обов'язковий"),
  password: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Лише латиниця")
    .required("Пароль обов'язковий"),
});

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, isLoggedIn } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (values: { email: string; password: string }) => {
    dispatch(login(values));
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/users");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (error) {
      setIsErrorAlertOpen(true);
    } else {
      setIsErrorAlertOpen(false);
    }
  }, [error]);

  return (
    <>
      <br />
      <br />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form
            style={{
              margin: "auto",
              padding: "25px",
              borderRadius: 5,
              width: 500,
              backgroundColor: "white",
            }}
          >
            <Typography variant="h4">Вхід</Typography>

            <Field
              as={TextField}
              label="Електронна пошта"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />

            <Field
              as={TextField}
              label="Пароль"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomTooltip
                      title={
                        showPassword ? "Приховати пароль" : "Показати пароль"
                      }
                      placement="right"
                    >
                      <IconButton
                        onClick={toggleShowPassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </CustomTooltip>
                  </InputAdornment>
                ),
              }}
            />

            <br />
            <br />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" color="success" type="submit">
                {loading ? <CustomLoader size="small" /> : <span>Увійти</span>}
              </Button>
              <Button variant="contained" color="inherit" type="reset">
                Скинути
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      {error && (
        <CustomSnackbar
          open={isErrorAlertOpen && !!error}
          handleClose={() => setIsErrorAlertOpen(false)}
          message={error || ""}
        />
      )}
    </>
  );
};

export default AuthPage;
