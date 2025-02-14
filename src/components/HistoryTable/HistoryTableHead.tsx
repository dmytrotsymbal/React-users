import { styled, TableCell, TableHead, TableRow } from "@mui/material";

type Props = {
  lightTheme: boolean;
};
const HistoryTableHead = ({ lightTheme }: Props) => {
  return (
    <TableHead
      sx={{
        backgroundColor: lightTheme ? "#7FA1C3" : "#526D82",
      }}
    >
      <TableRow>
        <StyledTableCell>Таблиця</StyledTableCell>
        <StyledTableCell>ID Запиту</StyledTableCell>
        <StyledTableCell>Працівник</StyledTableCell>
        <StyledTableCell>Запит</StyledTableCell>
        <StyledTableCell>Фільтри</StyledTableCell>
        <StyledTableCell>Дата пошуку</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default HistoryTableHead;

export const StyledTableCell = styled(TableCell)(() => ({
  color: "#DDE6ED",
}));
