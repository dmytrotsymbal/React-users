import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { User } from "../../../types/userTypes";
import { Box } from "@mui/material";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  user: User;
};

const ConfirmDeleteUserModal = ({
  open,
  handleClose,
  handleDelete,
  user,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <DialogTitle id="alert-dialog-title">Видалити запис</DialogTitle>
      </Box>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Ви впевнені, що хочете видалити запис {user.firstName} {user.lastName}
          ?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 24px",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          autoFocus
        >
          Так
        </Button>

        <Button variant="contained" color="inherit" onClick={handleClose}>
          Ні
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteUserModal;
