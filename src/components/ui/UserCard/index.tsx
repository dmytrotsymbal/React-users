import { Paper, Grid, Typography, IconButton, Avatar } from "@mui/material";
import NoProfilePicture from "../../../assets/images/noProfilePicture.png";
import { User } from "../../../types/userTypes";
import { useNavigate } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";

type Props = {
  user: User;
  handleOpenModal: (user: User) => void;
};
const UserCard = ({ user, handleOpenModal }: Props) => {
  const navigate = useNavigate();
  return (
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

          <p>{new Date(user.dateOfBirth).toLocaleDateString("uk-UA")}</p>
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
              handleOpenModal(user);
            }}
          >
            <RemoveIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};
export default UserCard;
