import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { getHistory } from "../../store/historySlice";
import HistoryTableHead from "./HistoryTableHead";
import HistoryTableSkeletonRow from "./HistoryTableSkeletonRow";
import CustomErrorBlock from "../ui/CustomErrorBlock";
import { formatDateTime } from "../../utils/formatDateTime";

const HistoryTable = () => {
  const dispatch = useAppDispatch();

  const lightTheme = useAppSelector((state) => state.theme.lightTheme);

  const { history, loading, error } = useAppSelector(
    (state: RootState) => state.history
  );

  useEffect(() => {
    dispatch(getHistory());
  }, [dispatch]);

  return (
    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
      <Table>
        <HistoryTableHead lightTheme={lightTheme} />

        <TableBody>
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <HistoryTableSkeletonRow key={`skeleton-${i}`} />
            ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8}>
                <CustomErrorBlock />
              </TableCell>
            </TableRow>
          ) : (
            history.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor:
                    item.searchType === "cars"
                      ? { backgroundColor: "lightblue" }
                      : { backgroundColor: "lightpink" },
                }}
              >
                <TableCell>{item.searchID}</TableCell>
                <TableCell>{item.staffID}</TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: item.searchType === "cars" ? "blue" : "green",
                  }}
                >
                  {item.searchType.toUpperCase()}
                </TableCell>
                <TableCell>{item.searchQuery}</TableCell>
                <TableCell>{item.searchFilters || "{}"}</TableCell>
                <TableCell>{formatDateTime(item.searchDate)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
