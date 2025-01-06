import { TableCell, TableRow, Skeleton, Box } from "@mui/material";

const HistoryTableSkeletonRow = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Skeleton animation="wave" height={35} variant="text" />

          <Skeleton animation="wave" height={35} variant="text" />

          <Skeleton animation="wave" height={35} width={100} variant="text" />
        </Box>
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
    </TableRow>
  );
};
export default HistoryTableSkeletonRow;
