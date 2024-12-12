import { Snackbar, Alert, Slide, Box } from "@mui/material";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "../../../assets/emojis/data.json";

type Props = {
  open: boolean;
  handleClose: () => void;
  message: string;
  severity: "success" | "info" | "warning" | "error";
};

const CustomSnackbar = ({ open, handleClose, message, severity }: Props) => {
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
          severity={severity}
          variant="filled"
          icon={false}
          sx={{
            width: "330px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji
                name={
                  severity === "error"
                    ? "face-with-raised-eyebrow"
                    : severity === "warning"
                    ? "thinking-face"
                    : severity === "info"
                    ? "nerd-face"
                    : "ok-hand-light-skin-tone"
                }
                width={24}
              />
            </EmojiProvider>

            <p style={{ marginLeft: "10px" }}>{message}</p>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
};
export default CustomSnackbar;
