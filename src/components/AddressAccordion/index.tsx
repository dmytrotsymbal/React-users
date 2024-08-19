import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useState } from "react";
import { getAllUsersAddresses } from "../../redux/addressSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddressTableSkeletonRow from "./AddressTableSkeletonRow";

type Props = {
  isAddressVisible: boolean;
  showAllUsersAdresses: () => void;
};

const AddressAccordion = ({
  isAddressVisible,
  showAllUsersAdresses,
}: Props) => {
  const { userId = "" } = useParams<{ userId: string | undefined }>(); // Отримуємо параметр userId з URL

  const dispatch = useAppDispatch();
  const { addresses, loading, error } = useAppSelector(
    (state: RootState) => state.address
  );

  const [isExpanded, setIsExpanded] = useState(false); // Додаємо стан для відстеження відкриття аккордеону

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsExpanded(isExpanded);

    if (isExpanded && !isAddressVisible) {
      // Затримка для завершення анімації
      setTimeout(() => {
        dispatch(getAllUsersAddresses(userId));
        console.log("СРАБОТАЛА ФУНКЦИЯ getAllUsersAddresses");
        showAllUsersAdresses();
      }, 300); // Затримка в мілісекундах (300 мс)
    }
  };

  return (
    <>
      <Accordion expanded={isExpanded} onChange={handleAccordionChange}>
        <AccordionSummary
          sx={{ backgroundColor: "#7FA1C3", color: "white !important" }}
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "white !important",
              }}
            />
          }
        >
          <Typography>Нерухомість</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{
                  backgroundColor: "#7FA1C3",
                  color: "white !important",
                }}
              >
                <TableRow>
                  <TableCell>ID Адреси</TableCell>
                  <TableCell>Вулиця</TableCell>
                  <TableCell>Місто</TableCell>
                  <TableCell>Область</TableCell>
                  <TableCell>Поштовий індекс</TableCell>
                  <TableCell>Країна</TableCell>
                  <TableCell>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  // Показуємо скелетони під час завантаження
                  Array.from({ length: 2 }).map((_, i) => (
                    <AddressTableSkeletonRow key={`skeleton-${i}`} />
                  ))
                ) : error ? (
                  // Показуємо повідомлення про помилку
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6" color="error">
                        Помилка завантаження: {error}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Відображаємо адреси, якщо вони є
                  addresses.map((address) => (
                    <TableRow key={address.addressID}>
                      <TableCell>{address.addressID}</TableCell>
                      <TableCell>{address.streetAddress}</TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell>{address.state}</TableCell>
                      <TableCell>{address.postalCode}</TableCell>
                      <TableCell>{address.country}</TableCell>

                      <TableCell>
                        <IconButton>
                          <EditIcon />
                        </IconButton>

                        <IconButton>
                          <DeleteForeverIcon sx={{ color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AddressAccordion;
