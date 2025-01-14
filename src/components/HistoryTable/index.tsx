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
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import {
  getCurrentStaffSearchHistory,
  getCurrentStaffSearchHistoryQantity,
} from "../../store/historySlice";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatFiltersColumns } from "../../utils/formatFilters";
import HistoryTableHead from "./HistoryTableHead";
import HistoryTableSkeletonRow from "./HistoryTableSkeletonRow";
import CustomErrorBlock from "../ui/CustomErrorBlock";
import CustomPagination from "../ui/CustomPagination";

const HistoryTable = () => {
  const dispatch = useAppDispatch();

  const lightTheme = useAppSelector((state) => state.theme.lightTheme);

  const { history, loading, error, historyQuantity } = useAppSelector(
    (state: RootState) => state.history
  );

  useEffect(() => {
    dispatch(getCurrentStaffSearchHistoryQantity());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;
  const totalPages = Math.ceil(Number(historyQuantity) / pageSize);

  useEffect(() => {
    dispatch(
      getCurrentStaffSearchHistory({ pageNumber: currentPage, pageSize })
    );
  }, [dispatch, currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setCurrentPage(value);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
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
              history.map((item, index) => {
                const filters = formatFiltersColumns(
                  item.searchFilters as string,
                  item.searchType
                );

                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        item.searchType === "cars" ? "#E4E0E1" : "white",
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
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {typeof filters === "string" ? (
                          <Box sx={{ fontStyle: "italic", color: "gray" }}>
                            {filters}
                          </Box>
                        ) : (
                          filters.map((filter, i) => (
                            <Box key={i} sx={{ display: "flex", mb: 0.5 }}>
                              <b>{filter.label}:</b>&nbsp;{filter.value}
                            </Box>
                          ))
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>{formatDateTime(item.searchDate)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
      >
        <CustomPagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </Box>
    </>
  );
};

export default HistoryTable;
