import { styled, TableCell, TableHead, TableRow } from "@mui/material";

type Props = {
  lightTheme: boolean;
};
const TopSearchersTableHead = ({ lightTheme }: Props) => {
  return (
    <TableHead
      sx={{
        backgroundColor: lightTheme ? "#7FA1C3" : "#526D82",
      }}
    >
      <TableRow>
        <StyledTableCell>ID</StyledTableCell>
        <StyledTableCell>Нікнейм</StyledTableCell>
        <StyledTableCell>Роль</StyledTableCell>
        <StyledTableCell>Кількість запитів</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default TopSearchersTableHead;

export const StyledTableCell = styled(TableCell)(() => ({
  color: "#DDE6ED",
}));
