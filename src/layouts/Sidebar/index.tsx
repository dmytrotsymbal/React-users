import { useState } from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { User } from "../../types/userTypes";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  clearSelectedUsers,
  removeUserFromSelectedList,
} from "../../redux/userSlice";
import ConfirmDeleteUserFromListModal from "../../components/modals/ConfirmDeleteUserFromListModal";
import CustomTooltip from "../../components/ui/CustomTooltip";
import UserCard from "../../components/ui/UserCard";
import CustomSnackbar from "../../components/ui/CustomSnackbar";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "../../assets/emojis/data.json";

type Props = {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  lightTheme: boolean;
};

const Sidebar = ({ isDrawerOpen, toggleDrawer, lightTheme }: Props) => {
  const dispatch = useAppDispatch();
  const selectedUsers = useAppSelector((state) => state.user.selectedUsers);

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      dispatch(removeUserFromSelectedList(selectedUser));
      handleCloseModal();
    }
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 370,
            padding: "80px 10px 10px 10px",
            height: "100vh",
            backgroundColor: lightTheme ? "#6482AD" : "#27374D",
            color: "white",
          }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          {selectedUsers?.length > 0 ? (
            <Box
              sx={{
                height: "600px",
                overflow: "auto",
                padding: "10px",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: "0",
                  margin: "0",
                }}
              >
                {selectedUsers?.map((user: User) => (
                  <li key={user.userID}>
                    <UserCard user={user} handleOpenModal={handleOpenModal} />
                  </li>
                ))}
              </ul>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "600px",
                overflow: "auto",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EmojiProvider data={emojiData}>
                <Emoji name="man-shrugging-light-skin-tone" width={50} />
              </EmojiProvider>
              <Typography
                sx={{
                  fontSize: "16px",
                  textAlign: "center",
                  mt: 2,
                }}
                color="whitesmoke"
                gutterBottom
              >
                Не вибрано жодного користувача
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              padding: "10px",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              backgroundColor: lightTheme ? "#6482AD" : "#27374D",
            }}
          >
            <CustomTooltip title="Очистити" placement="top">
              <IconButton
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderRadius: "50%",
                  padding: "8px",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                  },
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch(clearSelectedUsers());
                  setSnackbarOpen(true);
                }}
              >
                <DeleteForeverIcon
                  sx={{
                    color: "whitesmoke",
                  }}
                />
              </IconButton>
            </CustomTooltip>
          </Box>
        </Box>
      </Drawer>

      <ConfirmDeleteUserFromListModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        handleDelete={handleDeleteUser}
        user={selectedUser}
      />

      {isSnackbarOpen && (
        <CustomSnackbar
          open={isSnackbarOpen}
          handleClose={() => setSnackbarOpen(false)}
          message="Закладки успішно очищені"
          severity="success"
        />
      )}
    </>
  );
};

export default Sidebar;
