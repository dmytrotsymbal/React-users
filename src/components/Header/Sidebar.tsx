import {
  Drawer,
  Box,
  Paper,
  Grid,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import NoProfilePicture from "../../assets/noProfilePicture.webp";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { User } from "../../types/userTypes";
import { useNavigate } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  clearSelectedUsers,
  removeUserFromSelectedList,
} from "../../redux/userSlice";

type Props = {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  lightTheme: boolean;
};

const Sidebar = ({ isDrawerOpen, toggleDrawer, lightTheme }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedUsers = useAppSelector((state) => state.user.selectedUsers);

  return (
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
                  <Paper
                    onClick={() => navigate(`/user/${user.userID}`)}
                    elevation={3}
                    sx={{
                      backgroundColor: "#f5eded !important",
                      color: "black",
                      width: "100%",
                      cursor: "pointer",
                      marginBottom: "25px",
                      height: "100px",
                      padding: "10px",
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        {!user.photos?.length ? (
                          <Avatar
                            sx={{ width: "75px", height: "75px" }}
                            alt="No profile image"
                            src={NoProfilePicture}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: "75px",
                              height: "75px",
                            }}
                            src={user.photos[0]?.imageURL}
                            alt="user-avatar"
                          />
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          {user.firstName} {user.lastName}
                        </Typography>

                        <p>
                          {new Date(user.dateOfBirth).toLocaleDateString(
                            "uk-UA"
                          )}
                        </p>
                      </Grid>

                      <Grid item xs={2}>
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
                            dispatch(removeUserFromSelectedList(user));
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </li>
              ))}
            </ul>
          </Box>
        ) : (
          <Box
            sx={{
              height: "600px",
              overflow: "auto",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="whitesmoke" gutterBottom>
              Не вибрано жодного користувача
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            padding: "5px",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
          }}
        >
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
            }}
          >
            <DeleteForeverIcon
              sx={{
                color: "whitesmoke",
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
