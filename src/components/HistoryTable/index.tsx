import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Chip,
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
    <TableContainer component={Paper} sx={{ marginTop: 4, marginBottom: 2 }}>
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
                    item.searchType === "cars" ? "#FEF3E2" : "#C9DABF",
                }}
              >
                <TableCell>
                  <b>{item.searchType}</b>
                </TableCell>
                <TableCell>{item.searchID}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <b>{item.nickname}</b>
                    <p>{item.email}</p>
                    <Chip
                      size="small"
                      sx={{ maxWidth: 100, mt: 2 }}
                      label={item?.role}
                      color={
                        item?.role === "admin"
                          ? "error"
                          : item?.role === "moderator"
                          ? "warning"
                          : "success"
                      }
                    />
                  </Box>
                </TableCell>

                <TableCell>{item.searchQuery}</TableCell>
                <TableCell>
                  <pre>
                    {JSON.stringify(
                      JSON.parse(item.searchFilters || "{}"),
                      null,
                      2
                    )}
                  </pre>
                </TableCell>
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
