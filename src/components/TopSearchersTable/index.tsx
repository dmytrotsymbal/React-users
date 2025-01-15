import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
import { getTopSearchers } from "../../store/authSlice";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import CustomErrorBlock from "../ui/CustomErrorBlock";
import TopSearchersTableSkeletonRow from "./TopSearchersTableSkeletonRow";
import TopSearchersTableHead from "./TopSearchersTableHead";

const TopSearchersTable = () => {
  const dispatch = useAppDispatch();

  const lightTheme = useAppSelector((state) => state.theme.lightTheme);

  const { topSearchers, loading, error } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(getTopSearchers());
  }, [dispatch]);

  console.log(topSearchers);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TopSearchersTableHead lightTheme={lightTheme} />

          <TableBody>
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TopSearchersTableSkeletonRow key={`skeleton-${i}`} />
                ))}
              </>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <CustomErrorBlock />
                </TableCell>
              </TableRow>
            ) : (
              topSearchers.map((topSearcher) => (
                <TableRow key={topSearcher.staffID}>
                  <TableCell>{topSearcher.staffID}</TableCell>

                  <TableCell>{topSearcher.nickname}</TableCell>
                  <TableCell>{topSearcher.role}</TableCell>
                  <TableCell>{topSearcher.searchCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default TopSearchersTable;
