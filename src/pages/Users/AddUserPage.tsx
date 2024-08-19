import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../redux/hooks";
import { createUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(
      /^[A-Z][a-zA-Z]*$/,
      "First Name must start with an uppercase letter and contain only Latin letters"
    )
    .max(40, "First Name must be at most 40 characters")
    .required("First Name is required"),
  lastName: Yup.string()
    .matches(
      /^[A-Z][a-zA-Z]*$/,
      "Last Name must start with an uppercase letter and contain only Latin letters"
    )
    .max(40, "Last Name must be at most 40 characters")
    .required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .max(55, "Email must be at most 55 characters")
    .required("Email is required"),
  dateOfBirth: Yup.string().required("Date of Birth is required"),
});

const AddUserPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState<string>("");

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const response = await fetch(
        `/api/User/check-email?email=${values.email}`
      );

      if (response.status === 409) {
        const data = await response.json();
        setEmailError(data.message);
        return;
      }

      await dispatch(createUser(values));
      navigate("/");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <>
      <br />
      <Paper style={{ padding: 16 }}>
        <Typography variant="h6" gutterBottom>
          Додати користувача в базу даних
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                label="First Name"
                name="firstName"
                margin="normal"
                helperText={<ErrorMessage name="firstName" />}
                error={Boolean(<ErrorMessage name="firstName" />)}
              />
              <Field
                as={TextField}
                fullWidth
                label="Last Name"
                name="lastName"
                margin="normal"
                helperText={<ErrorMessage name="lastName" />}
                error={Boolean(<ErrorMessage name="lastName" />)}
              />
              <Field
                as={TextField}
                fullWidth
                label="Email"
                name="email"
                margin="normal"
                helperText={emailError || <ErrorMessage name="email" />}
                error={
                  Boolean(emailError) || Boolean(<ErrorMessage name="email" />)
                }
                onFocus={() => setEmailError("")}
              />
              <Field
                as={TextField}
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                margin="normal"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={<ErrorMessage name="dateOfBirth" />}
                error={Boolean(<ErrorMessage name="dateOfBirth" />)}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button type="reset" color="secondary">
                  Скинути
                </Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  Додати
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </>
  );
};

export default AddUserPage;
