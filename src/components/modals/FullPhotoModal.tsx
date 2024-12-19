import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Photo } from "../../types/photoTypes";

type Props = {
  open: boolean;
  handleClose: () => void;
  photo: Photo;
};

const FullPhotoModal = ({ open, handleClose, photo }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
    >
      <DialogContent>
        <img src={photo.imageURL} alt={photo.altText} />
      </DialogContent>
    </Dialog>
  );
};

export default FullPhotoModal;
