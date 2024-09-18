import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addExistingUserToAddress } from "../../../redux/addressSlice";
import { getAllUsersIDs } from "../../../redux/userSlice";

type Props = {
  addressID: string | undefined;
  open: boolean;
  onClose: () => void;
};

const AddUserToAddressModal = ({ addressID, open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const usersIDs = useAppSelector((state) => state.user.usersIDs);

  const [selectedUserID, setSelectedUserID] = useState("");

  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState<string | null>("");

  useEffect(() => {
    if (open) {
      dispatch(getAllUsersIDs());
    }
  }, [dispatch, open]);

  const addressIDD = Number(addressID);

  const handleSubmit = () => {
    if (selectedUserID && moveInDate) {
      dispatch(
        addExistingUserToAddress({
          addressID: addressIDD,
          userID: selectedUserID,
          moveInDate,
          moveOutDate,
        })
      );
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Додати приживача до цієї адреси</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Пользователь"
          value={selectedUserID}
          onChange={(e) => setSelectedUserID(e.target.value)}
          helperText="Оберіть існуючого користувача"
        >
          {usersIDs.map((id) => (
            <MenuItem key={id} value={id}>
              {id}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Дата початку проживання"
          type="date"
          value={moveInDate}
          onChange={(e) => setMoveInDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="dense"
        />

        <TextField
          fullWidth
          label="Дата кінця проживання"
          type="date"
          value={moveOutDate || ""}
          onChange={(e) => setMoveOutDate(e.target.value || null)}
          InputLabelProps={{ shrink: true }}
          margin="dense"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Назад</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Додати
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserToAddressModal;
