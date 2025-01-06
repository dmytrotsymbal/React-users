import { Box, Chip } from "@mui/material";
import HistoryTable from "../../components/HistoryTable";

const CabinetPage = () => {
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
      <HistoryTable />
    </>
  );
};
export default CabinetPage;
