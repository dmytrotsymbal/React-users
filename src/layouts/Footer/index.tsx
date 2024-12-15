import { Box, Container, Typography } from "@mui/material";
import { useAppSelector } from "../../store/hooks";

const Footer = () => {
  const lightTheme = useAppSelector((state) => state.theme.lightTheme);
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: lightTheme ? "#6482AD" : "#27374D",
        color: "#fff",
        padding: "10px 0",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="body1">
          © {new Date().getFullYear()} React Users. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
