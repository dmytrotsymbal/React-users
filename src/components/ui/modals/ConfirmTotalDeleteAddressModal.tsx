import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { Address } from "../../../types/addressTypes";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  address: Address | null;
};

const ConfirmTotalDeleteAddressModal = ({
  open,
  handleClose,
  handleDelete,
  address,
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
        <DialogTitle id="alert-dialog-title">
          Видалити адресу з бази данних
        </DialogTitle>
      </Box>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Ви впевнені, що хочете видалити цю адрессу {address?.streetAddress} в{" "}
          {address?.city} з бази данних?
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
          onClick={() => {
            handleDelete();
            handleClose();
          }}
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

export default ConfirmTotalDeleteAddressModal;
