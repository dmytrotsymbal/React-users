import { Pagination } from "@mui/material";

type Props = {
  totalPages: number;
  currentPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
};
const CustomPagination = ({
  totalPages,
  currentPage,
  handlePageChange,
}: Props) => {
  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handlePageChange}
      variant="outlined"
      shape="rounded"
      color="primary"
      sx={{
        "& .MuiPaginationItem-root": {
          opacity: 1,
          backgroundColor: "transparent",
          color: "black",
          border: "0px",
          "&:hover": {
            backgroundColor: "#1976d2",
            color: "white",
          },
        },

        "& .Mui-selected": {
          opacity: 1,

          backgroundColor: "#1976d2 !important",
          color: "white !important",
        },
      }}
    />
  );
};
export default CustomPagination;
