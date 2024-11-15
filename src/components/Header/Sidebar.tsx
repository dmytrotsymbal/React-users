import { Drawer, Box } from "@mui/material";

type SidebarProps = {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  lightTheme: boolean;
};

const Sidebar = ({ isDrawerOpen, toggleDrawer, lightTheme }: SidebarProps) => {
  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      <Box
        sx={{
          width: 350,
          paddingTop: "80px",
          height: "100vh",
          backgroundColor: lightTheme ? "#6482AD" : "#27374D",
          color: "white",
        }}
        role="presentation"
        onClick={() => toggleDrawer(false)}
        onKeyDown={() => toggleDrawer(false)}
      ></Box>
    </Drawer>
  );
};

export default Sidebar;
