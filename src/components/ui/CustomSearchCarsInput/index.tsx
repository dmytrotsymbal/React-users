import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import TuneIcon from "@mui/icons-material/Tune";
import { useState, useEffect, useRef } from "react";
import CustomSearchCarsDropdown from "../CustomSearchCarsDropdown";

type Props = {
  searchQuery: string;
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
  placeholder: string;
};

const CustomSearchCarsInput = ({
  searchQuery,
  handleSearchInputChange,
  handleClearSearch,
  placeholder,
}: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    // клік не всередині dropdown або інпуту
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <TextField
        ref={inputRef}
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setIsDropdownOpen((prev) => !prev)}>
                <TuneIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box ref={dropdownRef}>
        <CustomSearchCarsDropdown
          isDropdownOpen={isDropdownOpen}
          searchQuery={searchQuery}
        />
      </Box>
    </Box>
  );
};

export default CustomSearchCarsInput;
