import { AppBar, Toolbar, Button, Container, Box } from "@mui/material";
import HeaderLogo from "../../assets/headerLogo.webp";
import { Link } from "react-router-dom";

const Header = () => {
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
              width: "170px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "#f5eded" }}>
              <Button color="inherit">Люди</Button>
            </Link>

            <Link
              to="/cars"
              style={{ textDecoration: "none", color: "#f5eded" }}
            >
              <Button color="inherit">Машини</Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
