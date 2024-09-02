import {
  Paper,
  Typography,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { Car } from "../../types/carTypes";
import { deleteCar } from "../../redux/carSlice";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import ConfirmDeleteCarModal from "../ui/modals/ConfirmDeleteCarModal";
import CarTableSkeletonRow from "../CarsTable/CarTableSkeletonRow";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  cars: Car[];
  loading: boolean;
  showAllUsersCars: () => void;
};

// Функция для имитации задержки
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CarAccordion = ({ cars, loading, showAllUsersCars }: Props) => {
  const { userId } = useParams<{ userId: string }>();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(loading);

  const handleDeleteCar = () => {
    if (selectedCar) {
      dispatch(deleteCar(selectedCar.carID));
      setOpenDeleteModal(true);
    }
  };

  const handleAccordionChange = async (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsAccordionOpen(isExpanded);
    if (isExpanded) {
      event.stopPropagation(); // Отмена действия по умолчанию
      setIsLoading(true);
      // await delay(2000);  Задержка на 2 секунды
      showAllUsersCars();
      setIsLoading(false);
    }
  };

  const [isFullSkeleton] = useState<boolean>(false);

  return (
    <>
      <Accordion
        onChange={(event, isExpanded) =>
          handleAccordionChange(event, isExpanded)
        }
      >
        <AccordionSummary
          sx={{
            backgroundColor: "#7FA1C3",
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
            <Typography>Автомобілі</Typography>

            {isAccordionOpen ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(`/car/add/${userId}`)}
              >
                Додати автомобіль
              </Button>
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
                  <TableCell>Car ID</TableCell>
                  <TableCell>Марка</TableCell>
                  <TableCell>Модель</TableCell>
                  <TableCell>Колір</TableCell>
                  <TableCell>Рік</TableCell>
                  <TableCell>Номерний знак</TableCell>
                  <TableCell>Фото</TableCell>
                  <TableCell>Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6">Немає автомобілів</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {isLoading
                      ? Array.from({ length: cars.length }).map((_, i) => (
                          <CarTableSkeletonRow
                            key={`skeleton-${i}`}
                            isFullSkeleton={isFullSkeleton}
                          />
                        ))
                      : cars.map((car) => (
                          <TableRow key={car.carID}>
                            <TableCell>{car.carID}</TableCell>
                            <TableCell>{car.firm}</TableCell>
                            <TableCell>{car.model}</TableCell>
                            <TableCell>{car.color}</TableCell>
                            <TableCell>{car.year}</TableCell>
                            <TableCell>{car.licensePlate}</TableCell>
                            <TableCell>
                              <Avatar
                                alt={car.carPhotoURL}
                                src={car.carPhotoURL}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  navigate(`/car/edit/${car.carID}`)
                                }
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCar(car);
                                  setOpenDeleteModal(true);
                                }}
                              >
                                <DeleteForeverIcon sx={{ color: "red" }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {openDeleteModal && (
        <ConfirmDeleteCarModal
          open={openDeleteModal}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={handleDeleteCar}
          car={selectedCar}
        />
      )}
    </>
  );
};

export default CarAccordion;
