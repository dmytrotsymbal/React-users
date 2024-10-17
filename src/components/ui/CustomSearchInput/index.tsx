import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";

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
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

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
          transition: "width 0.3s ease-in-out",
          ...(isFocused && { width: "500px" }),
        }}
        label={placeholder}
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
