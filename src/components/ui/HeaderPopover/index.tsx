import { Staff } from "../../../types/staffTypes";
import { Box, Chip, Grid, Typography, Menu, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAppDispatch } from "../../../store/hooks";
import { logout } from "../../../store/authSlice";
import { useState } from "react";
import ManageAccountModal from "../../modals/ManageAccountModal";
import { formatDateTime } from "../../../utils/formatDateTime";
import CustomTooltip from "../CustomTooltip";

type Props = {
  staff: Staff | null;
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  onClose: () => void;
};

const HeaderPopover = ({
  staff,
  isLoggedIn,
  isDropdownOpen,
  onClose,
}: Props) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const goLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  return (
    <Menu
      open={isDropdownOpen}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorEl={isDropdownOpen ? document.body : null}
      onClose={onClose}
      PaperProps={{
        style: {
          width: 250,
          height: "auto",
          marginTop: "55px",
          zIndex: 99999999999999,
          padding: "10px",
        },
      }}
    >
      {isLoggedIn ? (
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="h6">{staff?.nickname}</Typography>
            </Grid>

            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
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
              fontSize: "16px",
            }}
            href={`mailto:${staff?.email}`}
          >
            {staff?.email}
          </a>

          <br />
          <br />
          <p
            style={{
              fontSize: "15px",
            }}
          >
            {formatDateTime(staff?.createdAt as string)}
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
              <CustomTooltip title="Вийти з акаунту" placement="bottom">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "80px", height: "30px" }}
                  onClick={goLogout}
                >
                  <LogoutIcon />
                </Button>
              </CustomTooltip>
            </Grid>

            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <CustomTooltip title="Редагувати" placement="bottom">
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{ width: "80px", height: "30px" }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <ManageAccountsIcon />
                </Button>
              </CustomTooltip>
            </Grid>
          </Grid>
          {isModalOpen && (
            <ManageAccountModal
              open={isModalOpen}
              handleClose={() => setIsModalOpen(false)}
            />
          )}
        </Box>
      ) : (
        <Typography>Ви не увійшли</Typography>
      )}
    </Menu>
  );
};

export default HeaderPopover;
