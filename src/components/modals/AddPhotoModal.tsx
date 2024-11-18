import {
  Box,
  Button,
  TextField,
  DialogTitle,
  DialogActions,
  Dialog,
} from "@mui/material";
import { Photo } from "../../types/photoTypes";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type Props = {
  userId: string | undefined;
  open: boolean;
  onClose: () => void;
  onAdd: (photo: Omit<Photo, "imageID">) => void;
};

const validationSchema = Yup.object({
  imageURL: Yup.string()
    .url("Invalid URL format")
    .max(200, "Image URL must be at most 200 characters")
    .required("Image URL is required"),
  altText: Yup.string().required("Alt Text is required"),
});

const AddPhotoModal = ({ open, onClose, onAdd, userId }: Props) => {
  const initialValues: Omit<Photo, "imageID"> = {
    userID: userId || "",
    imageURL: "",
    altText: "",
    uploadedAt: new Date().toISOString(),
  };

  const handleSubmit = (values: Omit<Photo, "imageID">) => {
    onAdd(values);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        sx={{
          backgroundColor: "#7FA1C3",
          color: "white !important",
          width: "100%",
          height: "50px",
        }}
      >
        <DialogTitle id="alert-dialog-title">Додати фото</DialogTitle>
      </Box>

      <DialogActions>
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
                label="Image URL"
                name="imageURL"
                margin="normal"
                helperText={<ErrorMessage name="imageURL" />}
                error={Boolean(<ErrorMessage name="imageURL" />)}
              />
              <Field
                as={TextField}
                fullWidth
                label="Alt Text"
                name="altText"
                margin="normal"
                helperText={<ErrorMessage name="altText" />}
                error={Boolean(<ErrorMessage name="altText" />)}
              />

              <br />
              <br />
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Зберегти
                </Button>

                <Button onClick={onClose} variant="contained" color="inherit">
                  Скасувати
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogActions>
    </Dialog>
  );
};

export default AddPhotoModal;
