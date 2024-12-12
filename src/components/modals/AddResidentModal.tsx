import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addExistingUserToAddress } from "../../store/addressSlice";
import { searchUsersByName } from "../../store/userSlice";
import { RootState } from "../../store/store";
import useDebounce from "../../hooks/useDebounce";

type Props = {
  addressID: string | undefined;
  open: boolean;
  onClose: () => void;
};

const AddUserToAddressModal = ({ addressID, open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { users } = useAppSelector((state: RootState) => state.user);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [selectedUserID, setSelectedUserID] = useState<string | null>(null);
  const [moveInDate, setMoveInDate] = useState<string>("");
  const [moveOutDate, setMoveOutDate] = useState<string | null>("");

  useEffect(() => {
    if (debouncedSearchQuery) {
      dispatch(searchUsersByName(debouncedSearchQuery));
    }
  }, [debouncedSearchQuery, dispatch]);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedUserID(null);
      setMoveInDate("");
      setMoveOutDate("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (selectedUserID && moveInDate) {
      dispatch(
        addExistingUserToAddress({
          addressID: Number(addressID),
          userID: selectedUserID,
          moveInDate,
          moveOutDate,
        })
      );
      onClose();
    }
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
        <DialogTitle id="alert-dialog-title">
          Додати користувача в історію проживання
        </DialogTitle>
      </Box>
      <DialogContent>
        <Autocomplete
          options={users}
          getOptionLabel={(option) =>
            `${option.firstName} ${option.lastName} (ID: ${option.userID})`
          }
          onInputChange={(_, value) => setSearchQuery(value)}
          onChange={(_, value) => setSelectedUserID(value?.userID || null)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Пошук користувача за іменем або ID"
              fullWidth
              margin="dense"
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
        />

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

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 24px",
        }}
      >
        <Button
          onClick={handleSubmit}
          color="success"
          variant="contained"
          disabled={!selectedUserID || !moveInDate}
        >
          Додати
        </Button>
        <Button onClick={onClose} variant="contained" color="inherit">
          Назад
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserToAddressModal;
