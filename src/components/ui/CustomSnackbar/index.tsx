import { Snackbar, Alert, Slide } from "@mui/material";

type Props = {
  open: boolean;
  handleClose: () => void;
  message: string;
};

const CustomSnackbar = ({ open, handleClose, message }: Props) => {
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        sx={{
          marginTop: "70px",
          zIndex: 9999,
        }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{
            width: "330px",
            height: "60px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
export default CustomSnackbar;
