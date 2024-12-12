import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { useState } from "react";
import { getAddressLivingHistory } from "../../../store/addressSlice";
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
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import CustomNotFoundPaper from "../../ui/CustomNotFoundPaper";
import ResidentTableSkeletonRow from "./ResidentTableSkeletonRow";
import AddResidentModal from "../../modals/AddResidentModal";

type Props = {
  isLivingHistoryVisible: boolean;
  showAllLivingHistory: () => void;
};

const ResidentAccordion = ({
  isLivingHistoryVisible,
  showAllLivingHistory,
}: Props) => {
  const { addressId } = useParams<{ addressId: string }>();

  const dispatch = useAppDispatch();

  const lightTheme = useAppSelector((state) => state.theme.lightTheme);

  const { livingHistory, livingLoading, livingError } = useAppSelector(
    (state: RootState) => state.address
  );

  const [isResidentAccordionExpanded, setIsResidentAccordionExpanded] =
    useState<boolean>(false); // Додаємо стан для відстеження відкриття аккордеону

  const [isAddResidentModalOpen, setIsAddResidentModalOpen] =
    useState<boolean>(false);

  const handleAccordionChange = (
    _: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsResidentAccordionExpanded(isExpanded);

    if (isExpanded && !isLivingHistoryVisible) {
      setTimeout(() => {
        dispatch(getAddressLivingHistory(Number(addressId)));
        console.log("СРАБОТАЛА ФУНКЦИЯ getAddressLivingHistory");
        showAllLivingHistory();
      }, 1000);
    }
  };
  return (
    <>
      <Accordion
        expanded={isResidentAccordionExpanded}
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
            <Typography>Історія мешканців ції адреси</Typography>

            {isResidentAccordionExpanded ? (
              <IconButton
                sx={{ marginRight: "1rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddResidentModalOpen(true);
                }}
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
                  <TableCell>ID</TableCell>
                  <TableCell>Ім'я</TableCell>
                  <TableCell>Прізвище</TableCell>
                  <TableCell>Імейл</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {livingLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <ResidentTableSkeletonRow key={`skeleton-${i}`} />
                  ))
                ) : livingError ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6" color="error">
                        <CustomNotFoundPaper errorMessage={livingError} />
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : !livingHistory || livingHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6">У вас ще немає адрес</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  livingHistory.map((resident) => (
                    <TableRow key={resident.email}>
                      <TableCell>
                        {new Date(resident.moveInDate).toLocaleDateString(
                          "uk-UA"
                        )}{" "}
                        -{" "}
                        {!resident.moveOutDate ? (
                          "До тепер"
                        ) : (
                          <>
                            {new Date(resident.moveOutDate).toLocaleDateString(
                              "uk-UA"
                            )}
                          </>
                        )}
                      </TableCell>

                      <TableCell sx={{ maxWidth: "150px" }}>
                        <Link to={`/user/${resident.userID}`}>
                          {resident.userID}
                        </Link>
                      </TableCell>
                      <TableCell>{resident.firstName}</TableCell>
                      <TableCell>{resident.lastName}</TableCell>
                      <TableCell>{resident.email}</TableCell>

                      {/* <TableCell>
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
                        >
                          <DeleteForeverIcon sx={{ color: "red" }} />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {isAddResidentModalOpen && (
        <AddResidentModal
          addressID={addressId}
          open={isAddResidentModalOpen}
          onClose={() => setIsAddResidentModalOpen(false)}
        />
      )}
    </>
  );
};
export default ResidentAccordion;
