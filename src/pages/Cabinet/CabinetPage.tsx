import { Box, Chip, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import HistoryTable from "../../components/HistoryTable";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";

const CabinetPage = () => {
  const lightTheme = useAppSelector((state) => state.theme.lightTheme);
  const [value, setValue] = useState<string>("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };
  return (
    <>
      <br />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "130px",
        }}
      >
        <Chip label="Користувачі" sx={{ backgroundColor: "white" }} />
        <Chip label="Машини" sx={{ backgroundColor: "#E4E0E1" }} />
      </Box>

      <Box
        sx={{
          borderRadius: "4px",
          width: "100%",
          mt: 4,
          mb: 2,
          backgroundColor: "white",
        }}
      >
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{
                backgroundColor: lightTheme ? "#7FA1C3" : "#526D82",
                "& .MuiTabs-indicator": {
                  backgroundColor: lightTheme ? "#E4E0E1" : "#B0BEC5",
                },
              }}
            >
              <Tab
                label="Моя історія"
                value="1"
                sx={{
                  color: "white",
                  "&.Mui-selected": {
                    color: "lightgrey",
                    fontWeight: "bold",
                  },
                }}
              />
              <Tab
                label="Вся історія"
                value="2"
                sx={{
                  color: "white",
                  "&.Mui-selected": {
                    color: "lightgrey",
                    fontWeight: "bold",
                  },
                }}
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <HistoryTable />
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
        </TabContext>
      </Box>
    </>
  );
};
export default CabinetPage;
