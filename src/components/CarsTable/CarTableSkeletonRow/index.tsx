import { TableCell, TableRow, Skeleton } from "@mui/material";

type Props = {
  isFullSkeleton: boolean;
};

const CarTableSkeletonRow = ({ isFullSkeleton }: Props) => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" height={35} variant="text" />
      </TableCell>

      {isFullSkeleton === true ? (
        <TableCell>
          <Skeleton animation="wave" width={307} height={35} variant="text" />
        </TableCell>
      ) : null}
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
export default CarTableSkeletonRow;
