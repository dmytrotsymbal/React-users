import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { getAllHistory } from "../../store/historySlice";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

const AllHistoryTable = () => {
  const dispatch = useAppDispatch();

  const { history, loading, error } = useAppSelector(
    (state: RootState) => state.history
  );
  const { role } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (role === "admin") {
      dispatch(getAllHistory());
    }
  }, [dispatch, role]);

  if (role !== "admin") {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          У вас немає доступу до цієї інформації.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Завантаження...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          Помилка: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Таблиця</TableCell>
            <TableCell>ID Запиту</TableCell>
            <TableCell>Користувач</TableCell>
            <TableCell>Запит</TableCell>
            <TableCell>Фільтри</TableCell>
            <TableCell>Дата пошуку</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.searchType}</TableCell>
              <TableCell>{item.searchID}</TableCell>
              <TableCell>
                <Typography variant="body2">
                  <strong>{item.nickname}</strong>
                  <br />
                  {item.email}
                </Typography>
              </TableCell>
              <TableCell>{item.searchQuery}</TableCell>
              <TableCell>{item.searchFilters || "Без фільтрів"}</TableCell>
              <TableCell>
                {new Date(item.searchDate).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllHistoryTable;
