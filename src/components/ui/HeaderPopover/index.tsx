import { Staff } from "../../../types/staffTypes";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAppDispatch } from "../../../redux/hooks";
import { logout } from "../../../redux/authSlice";

type Props = {
  staff: Staff | null;
  isLoggedIn: boolean;
};

const HeaderPopover = ({ staff, isLoggedIn }: Props) => {
  const dispatch = useAppDispatch();

  const goLogout = () => {
    dispatch(logout());
    window.location.reload();
  };
  return (
    <>
      {isLoggedIn === true ? (
        <Box
          sx={{
            marginLeft: "-120px",
            width: "200px",
            backgroundColor: "white",
            position: "absolute",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "4px",
            padding: "5px",
            color: "black",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="h6">{staff?.nickname}</Typography>
            </Grid>

            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Chip
                label={staff?.role}
                color={
                  staff?.role === "admin"
                    ? "error"
                    : staff?.role === "moderator"
                    ? "warning"
                    : "success"
                }
              />
            </Grid>
          </Grid>

          <br />
          <a
            target="_blank"
            style={{
              fontSize: "12px",
            }}
            href={`mailto:${staff?.email}`}
          >
            {staff?.email}
          </a>

          <br />
          <br />
          <p>
            {" "}
            {new Date(staff?.createdAt as string).toLocaleDateString("uk-UA")}
          </p>

          <br />
          <Grid container spacing={1}>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "80px", height: "30px" }}
                onClick={goLogout}
              >
                <LogoutIcon />
              </Button>
            </Grid>

            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                color="info"
                sx={{ width: "80px", height: "30px" }}
              >
                <ManageAccountsIcon />
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            marginLeft: "-120px",
            width: "200px",
            height: "200px",
            backgroundColor: "white",
            position: "absolute",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: "4px",
            padding: "5px",
            color: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Ви не увійшли</p>
        </Box>
      )}
    </>
  );
};

export default HeaderPopover;
