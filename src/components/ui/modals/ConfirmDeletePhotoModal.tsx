import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { Photo } from "../../../types/photoTypes";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  photo: Photo;
};

const ConfirmDeletePhotoModal = ({
  open,
  handleClose,
  handleDelete,
  photo,
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
          Ви впевнені, що хочете видалити запис {photo.altText}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="info" onClick={handleClose}>
          Ні
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          autoFocus
        >
          Так
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeletePhotoModal;
