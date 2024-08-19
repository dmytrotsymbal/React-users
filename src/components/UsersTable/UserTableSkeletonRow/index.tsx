import { TableCell, TableRow, Skeleton } from "@mui/material";

const UserTableSkeletonRow = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="circular" animation="wave" width={40} height={40} />
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
        <Skeleton variant="circular" animation="wave" width={40} height={40} />
      </TableCell>
    </TableRow>
  );
};
export default UserTableSkeletonRow;
