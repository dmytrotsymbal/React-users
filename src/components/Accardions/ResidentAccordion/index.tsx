import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import { getAddressLivingHistory } from "../../../redux/addressSlice";
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
  // IconButton,
  Box,
} from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";
import CustomNotFoundPaper from "../../ui/CustomNotFoundPaper";
import ResidentTableSkeletonRow from "./ResidentTableSkeletonRow";

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

  const { livingHistory, livingLoading, livingError } = useAppSelector(
    (state: RootState) => state.address
  );

  const [isResidentAccordionExpanded, setIsResidentAccordionExpanded] =
    useState<boolean>(false); // Додаємо стан для відстеження відкриття аккордеону

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsResidentAccordionExpanded(isExpanded);

    if (isExpanded && !isLivingHistoryVisible) {
      // Затримка для завершення анімації
      setTimeout(() => {
        dispatch(getAddressLivingHistory(Number(addressId)));
        console.log("СРАБОТАЛА ФУНКЦИЯ getAddressLivingHistory");
        showAllLivingHistory();
      }, 1000); // Затримка в мілісекундах (300 мс)
    }
  };

  console.log(livingHistory);
  return (
    <>
      <Accordion
        expanded={isResidentAccordionExpanded}
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
            <Typography>Історія мешканців ції адреси</Typography>
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
                  <TableCell>Дата проживання</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Ім'я</TableCell>
                  <TableCell>Прізвище</TableCell>
                  <TableCell>Імейл</TableCell>
                  {/* <TableCell>Дії</TableCell> */}
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
    </>
  );
};
export default ResidentAccordion;
