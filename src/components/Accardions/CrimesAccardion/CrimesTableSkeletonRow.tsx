import { TableCell, TableRow, Skeleton } from "@mui/material";

const CrimesTableSkeletonRow = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
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
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
      <TableCell
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
        }}
      >
        <Skeleton variant="circular" animation="wave" width={40} height={40} />
        <Skeleton variant="circular" animation="wave" width={40} height={40} />
      </TableCell>
    </TableRow>
  );
};
export default CrimesTableSkeletonRow;
