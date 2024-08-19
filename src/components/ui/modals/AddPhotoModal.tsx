import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Photo } from "../../../types/photoTypes";
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
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          margin: "auto",
          mt: "20vh",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Photo
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
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button onClick={onClose} color="error" variant="contained">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="success"
                  disabled={isSubmitting}
                  variant="contained"
                >
                  Add Photo
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddPhotoModal;
