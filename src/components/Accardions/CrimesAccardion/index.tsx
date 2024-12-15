import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import CustomTooltip from "../../ui/CustomTooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CrimesTableSkeletonRow from "./CrimesTableSkeletonRow";
import ConfirmDeleteCrimeModal from "../../modals/ConfirmDeleteCrimeModal";
import {
  deleteCriminalRecord,
  getAllUsersCriminalRecords,
} from "../../../store/criminalRecordSlice";
import { CriminalRecords } from "../../../types/criminalRecordsTypes";

type Props = {
  isCrimesVisible: boolean;
  showAllUsersCrimes: () => void;
};

const CrimesAccardion = ({ isCrimesVisible, showAllUsersCrimes }: Props) => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const lightTheme = useAppSelector((state) => state.theme.lightTheme);

  const { criminalRecords, loading, error } = useAppSelector(
    (state: RootState) => state.crime
  );

  const [isCrimeAccordionExpanded, setIsCrimeAccordionExpanded] =
    useState<boolean>(false);

  const [hoveredPrisonId, setHoveredPrisonId] = useState<number | null>(null);

  const handleAccordionChange = (
    _: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsCrimeAccordionExpanded(isExpanded);
    if (isExpanded && !isCrimesVisible) {
      setTimeout(() => {
        dispatch(getAllUsersCriminalRecords(String(userId)));
        console.log("СПРАЦЮВАЛА ФУНКЦІЯ getAllUsersCriminalRecords");
        showAllUsersCrimes();
      }, 1000);
    }
  };

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedCrime, setSelectedCrime] = useState<CriminalRecords | null>(
    null
  );

  const handleDeleteCriminalRecord = () => {
    if (selectedCrime) {
      dispatch(deleteCriminalRecord(selectedCrime.criminalRecordID));
      setOpenDeleteModal(true);
    }
  };

  return (
    <>
      <Accordion
        expanded={isCrimeAccordionExpanded}
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
            <Typography>Судимості</Typography>
            {isCrimeAccordionExpanded ? (
              <IconButton
                sx={{ marginRight: "1rem" }}
                onClick={() => navigate(`/crime/add/${userId}`)}
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
                  <TableCell>Дата заключення</TableCell>
                  <TableCell>Дата виходу</TableCell>
                  <TableCell>№ Статті</TableCell>
                  <TableCell>Вирок</TableCell>
                  <TableCell>Деталі справи</TableCell>
                  <TableCell>Тюрьма</TableCell>
                  <TableCell>Деталі справи</TableCell>
                  <TableCell>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <CrimesTableSkeletonRow key={`skeleton-${i}`} />
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6" color="error">
                        У цього користувача нема судимостей
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : !criminalRecords || criminalRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6">
                        У цього користувача нема судимостей
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  criminalRecords.map((crime) => (
                    <TableRow key={crime.criminalRecordID}>
                      <TableCell>
                        {new Date(crime.convictionDate).toLocaleDateString(
                          "uk-UA"
                        )}
                      </TableCell>
                      <TableCell>
                        {!crime.releaseDate
                          ? "До тепер"
                          : new Date(crime.releaseDate).toLocaleDateString(
                              "uk-UA"
                            )}
                      </TableCell>
                      <TableCell>{crime.article}</TableCell>
                      <TableCell>{crime.sentence}</TableCell>
                      <TableCell>
                        <Link to={crime.caseDetailsURL || ""}>
                          Подробиці справи
                        </Link>
                      </TableCell>
                      <TableCell
                        onMouseEnter={() =>
                          setHoveredPrisonId(crime.prison.prisonID)
                        }
                        onMouseLeave={() => setHoveredPrisonId(null)}
                      >
                        <CustomTooltip
                          title={
                            hoveredPrisonId === crime.prison.prisonID
                              ? `${crime.prison.prisonName}, ${crime.prison.location}, ${crime.prison.capacity}, ${crime.prison.securityLevel}`
                              : ""
                          }
                          placement="top"
                        >
                          <div
                            style={{
                              cursor: "pointer",
                              width: "30px",
                              height: "30px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {crime.criminalRecordID}
                          </div>
                        </CustomTooltip>
                      </TableCell>
                      <TableCell>{crime.details}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/crime/edit/${crime.criminalRecordID}`);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCrime(crime);
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
        <ConfirmDeleteCrimeModal
          open={openDeleteModal}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={handleDeleteCriminalRecord}
          crime={selectedCrime}
        />
      )}
    </>
  );
};

export default CrimesAccardion;
