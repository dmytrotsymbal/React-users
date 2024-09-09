import { IconButton } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode; // Проп для передачи иконки
  onClick: () => void;
  color?: "inherit" | "primary" | "secondary" | "default"; // Опционально: цвет кнопки
}

const CustomIconButton = ({
  icon,
  onClick,
  color = "primary", // Цвет по умолчанию
}: Props) => {
  return (
    <IconButton
      onClick={onClick}
      color={color}
      sx={{
        position: "absolute",
        top: "10px",
        left: "-60px",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: "50%",
        padding: "8px",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {icon}
    </IconButton>
  );
};

export default CustomIconButton;
