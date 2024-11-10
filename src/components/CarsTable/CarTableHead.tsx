import {
  styled,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";

type Props = {
  lightTheme: boolean;
  sortBy: string;
  sortDirection: "asc" | "desc";
  handleSort: (column: string) => void;
};
const CarTableHead = ({
  lightTheme,
  sortBy,
  sortDirection,
  handleSort,
}: Props) => {
  return (
    <TableHead
      sx={{
        backgroundColor: lightTheme ? "#7FA1C3" : "#526D82",
      }}
    >
      <TableRow>
        <StyledTableCell>Car ID</StyledTableCell>
        <StyledTableCell>User ID</StyledTableCell>
        <StyledTableCell>
          <StyledTableSortLabel
            active={sortBy === "Firm"}
            direction={sortBy === "Firm" ? sortDirection : "asc"}
            onClick={() => handleSort("Firm")}
          >
            Марка
          </StyledTableSortLabel>
        </StyledTableCell>
        <StyledTableCell>
          <StyledTableSortLabel
            active={sortBy === "Model"}
            direction={sortBy === "Model" ? sortDirection : "asc"}
            onClick={() => handleSort("Model")}
          >
            Модель
          </StyledTableSortLabel>
        </StyledTableCell>
        <StyledTableCell>Колір</StyledTableCell>
        <StyledTableCell>
          <StyledTableSortLabel
            active={sortBy === "Year"}
            direction={sortBy === "Year" ? sortDirection : "asc"}
            onClick={() => handleSort("Year")}
          >
            Рік
          </StyledTableSortLabel>
        </StyledTableCell>
        <StyledTableCell>Номерний знак</StyledTableCell>
        <StyledTableCell>Фото</StyledTableCell>
        <StyledTableCell>Дії</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};
export default CarTableHead;

export const StyledTableCell = styled(TableCell)(() => ({
  color: "#DDE6ED",
  cursor: "pointer",
}));

export const StyledTableSortLabel = styled(TableSortLabel)(() => ({
  color: "#DDE6ED !important",
  cursor: "pointer",

  "& .MuiTableSortLabel-icon": {
    color: "#DDE6ED !important",
  },
}));
