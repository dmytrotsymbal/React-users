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

const UserTableHead = ({
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
        <StyledTableCell>User ID</StyledTableCell>
        <StyledTableCell>Фото</StyledTableCell>

        <StyledTableCell>
          <StyledTableSortLabel
            active={sortBy === "FirstName"}
            direction={sortBy === "FirstName" ? sortDirection : "asc"}
            onClick={() => handleSort("FirstName")}
          >
            Ім'я
          </StyledTableSortLabel>
        </StyledTableCell>

        <StyledTableCell>
          <StyledTableSortLabel
            active={sortBy === "LastName"}
            direction={sortBy === "LastName" ? sortDirection : "asc"}
            onClick={() => handleSort("LastName")}
          >
            Прізвище
          </StyledTableSortLabel>
        </StyledTableCell>

        <StyledTableCell>Імейл</StyledTableCell>

        <StyledTableCell>
          <StyledTableSortLabel
            active={sortBy === "DateOfBirth"}
            direction={sortBy === "DateOfBirth" ? sortDirection : "asc"}
            onClick={() => handleSort("DateOfBirth")}
          >
            Дата народження
          </StyledTableSortLabel>
        </StyledTableCell>

        <StyledTableCell>
          <StyledTableSortLabel
            active={sortBy === "CreatedAt"}
            direction={sortBy === "CreatedAt" ? sortDirection : "asc"}
            onClick={() => handleSort("CreatedAt")}
          >
            Запис створено
          </StyledTableSortLabel>
        </StyledTableCell>

        <StyledTableCell>Дії</StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

export default UserTableHead;

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
