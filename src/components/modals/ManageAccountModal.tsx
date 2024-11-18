import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Box, Grid, TextField } from "@mui/material";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ManageAccountModal = ({ open, handleClose }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      PaperProps={{
        sx: {
          width: 1300,
          height: 275,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#7FA1C3",
          color: "white",
          height: "50px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Налаштування особистого кабінету
        </DialogTitle>
      </Box>

      <DialogContent>
        <DialogContentText id="alert-dialog-description" color="white">
          <TextField
            label="Нікнейм"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "16px" }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Імейл"
                type="email"
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Пароль"
                type="password"
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px 24px",
        }}
      >
        <Button variant="contained" color="success" type="submit">
          Зберегти
        </Button>

        <Button type="reset" variant="contained" color="inherit">
          Скинути
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageAccountModal;
