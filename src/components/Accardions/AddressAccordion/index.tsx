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
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { useState } from "react";
import {
  removeAddressFromUser,
  getAllUsersAddresses,
} from "../../../store/addressSlice";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddressTableSkeletonRow from "./AddressTableSkeletonRow";
import { Address } from "../../../types/addressTypes";
import ConfirmDeleteAddressModal from "../../modals/ConfirmDeleteAddressModal";
import CustomNotFoundPaper from "../../ui/CustomNotFoundPaper";

type Props = {
  isAddressVisible: boolean;
  showAllUsersAdresses: () => void;
};

const AddressAccordion = ({
  isAddressVisible,
  showAllUsersAdresses,
}: Props) => {
  const { userId } = useParams<{ userId: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const lightTheme = useAppSelector((state) => state.theme.lightTheme);

  const { addresses, loading, error } = useAppSelector(
    (state: RootState) => state.address
  );

  const { staff } = useAppSelector((state: RootState) => state.auth);

  const [isAddressAccordionExpanded, setIsAddressAccordionExpanded] =
    useState<boolean>(false); // стан для відстеження відкриття аккордеону

  const handleAccordionChange = (
    _: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsAddressAccordionExpanded(isExpanded);

    if (isExpanded && !isAddressVisible) {
      setTimeout(() => {
        dispatch(getAllUsersAddresses(String(userId)));
        console.log("СПРАЦЮВАЛА ФУНКЦІЯ getAllUsersAddresses");
        showAllUsersAdresses();
      }, 1000);
    }
  };

  // delete address
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleDeleteAddress = () => {
    if (selectedAddress) {
      dispatch(
        removeAddressFromUser({
          userID: String(userId),
          addressID: selectedAddress.addressID,
        })
      );
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
          sx={{
            backgroundColor: lightTheme ? "#7FA1C3" : "#526D82",
            color: "white !important",
          }}
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
        <AccordionDetails sx={{ padding: "0px !important" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{
                  backgroundColor: "#7FA1C3",
                  color: "white !important",
                }}
              >
                <TableRow>
                  <TableCell>Дата проживання</TableCell>
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
                  Array.from({ length: 2 }).map((_, i) => (
                    <AddressTableSkeletonRow key={`skeleton-${i}`} />
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6" color="error">
                        <CustomNotFoundPaper errorMessage={error} />
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : !addresses || addresses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="h6">
                        У цього користувача нема історії проживання
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  addresses.map((address) => (
                    <TableRow
                      key={address.addressID}
                      onClick={() => navigate(`/address/${address.addressID}`)}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell>
                        {new Date(address.moveInDate).toLocaleDateString(
                          "uk-UA"
                        )}{" "}
                        -{" "}
                        {!address.moveOutDate ? (
                          "До тепер"
                        ) : (
                          <>
                            {new Date(address.moveOutDate).toLocaleDateString(
                              "uk-UA"
                            )}
                          </>
                        )}
                      </TableCell>

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
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/address/edit/${address.addressID}`);
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAddress(address);
                            setOpenDeleteModal(true);
                          }}
                          disabled={staff?.role !== "admin"}
                        >
                          <RemoveIcon />
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
