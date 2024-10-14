import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  IconButton,
} from "@mui/material";
import HeaderLogo from "../../assets/headerLogo.webp";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { toggleTheme } from "../../redux/themeSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const lightTheme = useAppSelector((state) => state.theme.lightTheme);
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#6482AD",
        position: "sticky",
        top: 0,
        zIndex: 1000000000,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img src={HeaderLogo} alt="logo" style={{ width: "50px" }} />

          <Box
            sx={{
              width: "250px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              to="/users"
              style={{ textDecoration: "none", color: "#f5eded" }}
            >
              <Button color="inherit">Люди</Button>
            </Link>

            <Link
              to="/cars"
              style={{ textDecoration: "none", color: "#f5eded" }}
            >
              <Button color="inherit">Машини</Button>
            </Link>

            <IconButton onClick={() => dispatch(toggleTheme())}>
              {lightTheme ? (
                <LightModeIcon sx={{ color: "#f5eded" }} />
              ) : (
                <DarkModeIcon sx={{ color: "#f5eded" }} />
              )}
            </IconButton>

            <Link
              to="/auth"
              style={{ textDecoration: "none", color: "#f5eded" }}
            >
              <IconButton>
                <AccountCircleIcon sx={{ color: "#f5eded" }} />
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
