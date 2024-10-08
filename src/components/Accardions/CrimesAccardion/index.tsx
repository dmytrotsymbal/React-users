import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import { getAllUsersCriminalRecords } from "../../../redux/criminalRecordSlice";
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
import CustomNotFoundPaper from "../../ui/CustomNotFoundPaper";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CrimesTableSkeletonRow from "./CrimesTableSkeletonRow";
import CustomTooltip from "../../ui/CustomTooltip";

type Props = {
  isCrimesVisible: boolean;
  showAllUsersCrimes: () => void;
};

const CrimesAccardion = ({ isCrimesVisible, showAllUsersCrimes }: Props) => {
  const { userId } = useParams<{ userId: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { criminalRecords, loading, error } = useAppSelector(
    (state: RootState) => state.crime
  );

  const [isCrimeAccordionExpanded, setIsCrimeAccordionExpanded] =
    useState<boolean>(false);

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsCrimeAccordionExpanded(isExpanded);

    if (isExpanded && !isCrimesVisible) {
      // Затримка для завершення анімації
      setTimeout(() => {
        dispatch(getAllUsersCriminalRecords(String(userId)));
        console.log("СРАБОТАЛА ФУНКЦИЯ getAllUsersCriminalRecords");
        showAllUsersCrimes();
      }, 1000);
    }
  };

  const longtext = criminalRecords.map((criminalRecord) => {
    return (
      criminalRecord.prison.prisonName +
      "," +
      criminalRecord.prison.location +
      "," +
      criminalRecord.prison.capacity +
      "," +
      criminalRecord.prison.securityLevel
    );
  });

  return (
    <>
      <Accordion
        expanded={isCrimeAccordionExpanded}
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
            <Typography>Судимості</Typography>

            {isCrimeAccordionExpanded ? (
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
                        <CustomNotFoundPaper errorMessage={error} />
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
                        {!crime.releaseDate ? (
                          "До тепер"
                        ) : (
                          <>
                            {new Date(crime.releaseDate).toLocaleDateString(
                              "uk-UA"
                            )}
                          </>
                        )}
                      </TableCell>

                      <TableCell>{crime.article}</TableCell>
                      <TableCell>{crime.sentence}</TableCell>
                      <TableCell>
                        <Link to={crime.caseDetailsURL || ""}>
                          Подробиці справи
                        </Link>
                      </TableCell>

                      <CustomTooltip title={String(longtext)} placement="top">
                        <TableCell>{crime.prison.prisonID}</TableCell>
                      </CustomTooltip>

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

                        <IconButton>
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
    </>
  );
};
export default CrimesAccardion;
