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
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import {
  deleteAddress,
  getAllUsersAddresses,
} from "../../../redux/addressSlice";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddressTableSkeletonRow from "./AddressTableSkeletonRow";
import { Address } from "../../../types/addressTypes";
import ConfirmDeleteAddressModal from "../../ui/modals/ConfirmDeleteAddressModal";
import CustomNotFoundPaper from "../../ui/CustomNotFoundPaper";

type Props = {
  isAddressVisible: boolean;
  showAllUsersAdresses: () => void;
};

const AddressAccordion = ({
  isAddressVisible,
  showAllUsersAdresses,
}: Props) => {
  const { userId } = useParams<{ userId: string }>(); // Отримуємо параметр userId з URL

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { addresses, loading, error } = useAppSelector(
    (state: RootState) => state.address
  );

  const [isAddressAccordionExpanded, setIsAddressAccordionExpanded] =
    useState<boolean>(false); // Додаємо стан для відстеження відкриття аккордеону

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsAddressAccordionExpanded(isExpanded);

    if (isExpanded && !isAddressVisible) {
      // Затримка для завершення анімації
      setTimeout(() => {
        dispatch(getAllUsersAddresses(String(userId)));
        console.log("СРАБОТАЛА ФУНКЦИЯ getAllUsersAddresses");
        showAllUsersAdresses();
      }, 1000); // Затримка в мілісекундах (300 мс)
    }
  };

  // delete address

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleDeleteAddress = () => {
    if (selectedAddress) {
      dispatch(deleteAddress(selectedAddress.addressID));
      setOpenDeleteModal(true);
    }
  };

  return (
    <>
      <Accordion
        expanded={isAddressAccordionExpanded}
        onChange={handleAccordionChange}
      >
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography>Нерухомість</Typography>

            {isAddressAccordionExpanded ? (
              <IconButton
                sx={{ marginRight: "1rem" }}
                onClick={() => navigate(`/address/add/${userId}`)}
              >
                <AddIcon
                  sx={{
                    color: "white !important",
                  }}
                />
              </IconButton>
            ) : null}
          </Box>
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
                  {/* <TableCell>ID Адреси</TableCell> */}
                  <TableCell>Вулиця</TableCell>
                  <TableCell>№ будинку</TableCell>
                  <TableCell>№ квартири</TableCell>
                  <TableCell>Місто</TableCell>
                  <TableCell>Область</TableCell>
                  <TableCell>ПІ</TableCell>
                  <TableCell>Країна</TableCell>
                  <TableCell>Координати</TableCell>
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
                        <CustomNotFoundPaper errorMessage={error} />
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : !addresses || addresses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6">У вас ще немає адрес</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Відображаємо адреси, якщо вони є
                  addresses.map((address) => (
                    <TableRow key={address.addressID}>
                      {/* <TableCell align="center">{address.addressID}</TableCell> */}
                      <TableCell>{address.streetAddress}</TableCell>
                      <TableCell>{address.houseNumber}</TableCell>
                      <TableCell>{address.apartmentNumber}</TableCell>
                      <TableCell>{address.city}</TableCell>
                      <TableCell>{address.state}</TableCell>
                      <TableCell>{address.postalCode}</TableCell>
                      <TableCell>{address.country}</TableCell>
                      <TableCell>
                        {address.latitude && address.longitude ? (
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(
                                `https://www.google.com/maps?q=${address.latitude},${address.longitude}`,
                                "_blank"
                              );
                            }}
                          >
                            {address.latitude} {address.longitude}
                          </Link>
                        ) : (
                          "Координаты не заданы"
                        )}
                      </TableCell>

                      <TableCell>
                        <IconButton
                          onClick={() =>
                            navigate(`/address/edit/${address.addressID}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAddress(address);
                            setOpenDeleteModal(true);
                          }}
                        >
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

      {openDeleteModal && (
        <ConfirmDeleteAddressModal
          open={openDeleteModal}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={handleDeleteAddress}
          address={selectedAddress}
        />
      )}
    </>
  );
};

export default AddressAccordion;

// export const StyledTableCell = styled(TableCell)(() => ({
//   color: "black",
//   fontSize: "1rem",
//   borderLeft: "2px solid #229799",
//   borderRight: "2px solid #229799",

//   "&:first-child": {
//     borderLeft: "none",
//   },
//   "&:last-child": {
//     borderRight: "none",
//   },
// }));
