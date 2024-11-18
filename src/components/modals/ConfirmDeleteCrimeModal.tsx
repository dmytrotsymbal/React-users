import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { CriminalRecords } from "../../../types/criminalRecordsTypes";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  crime: CriminalRecords | null;
};

const ConfirmDeleteCrimeModal = ({
  open,
  handleClose,
  handleDelete,
  crime,
}: Props) => {
  const handleReloadPage = () => {
    window.location.reload();
  };
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
          Ви впевнені, що хочете видалити запис {crime?.criminalRecordID}{" "}
          {crime?.article}
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
            handleReloadPage();
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

export default ConfirmDeleteCrimeModal;
