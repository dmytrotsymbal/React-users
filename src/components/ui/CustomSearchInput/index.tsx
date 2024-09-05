import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

type Props = {
  searchQuery: string;
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
  placeholder: string;
};

const CustomSearchInput = ({
  searchQuery,
  handleSearchInputChange,
  handleClearSearch,
  placeholder,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextField
        sx={{
          width: "400px",
          position: "relative",
          zIndex: 100,
        }}
        label={placeholder}
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchInputChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
export default CustomSearchInput;
