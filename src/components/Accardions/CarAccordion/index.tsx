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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Car } from "../../../types/carTypes";
import { deleteCar, getAllUsersCars } from "../../../store/carSlice";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ConfirmDeleteCarModal from "../../modals/ConfirmDeleteCarModal";
import CarTableSkeletonRow from "../../CarsTable/CarTableSkeletonRow";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../store/store";
import NoCarPicture from "../../../assets/images/noCarPicture.png";

type Props = {
  isCarVisible: boolean;
  showAllUsersCars: () => void;
};

const CarAccordion = ({ isCarVisible, showAllUsersCars }: Props) => {
  const { userId } = useParams<{ userId: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const lightTheme = useAppSelector((state) => state.theme.lightTheme);

  const { cars, loading, error } = useAppSelector(
    (state: RootState) => state.car
  );

  const { staff } = useAppSelector((state: RootState) => state.auth);

  const [isCarAccordionExpanded, setIsCarAccordionExpanded] =
    useState<boolean>(false);

  const handleAccordionChange = (
    _: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setIsCarAccordionExpanded(isExpanded);
    if (isExpanded && !isCarVisible) {
      setTimeout(() => {
        dispatch(getAllUsersCars(String(userId)));
        console.log("СПРАЦЮВАЛА ФУНКЦІЯ getAllUsersCars");
        showAllUsersCars();
      }, 1000);
    }
  };

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const handleDeleteCar = () => {
    if (selectedCar) {
      dispatch(deleteCar(selectedCar.carID));
      setOpenDeleteModal(true);
    }
  };

  const [isFullSkeleton] = useState<boolean>(false);

  return (
    <>
      <Accordion
        expanded={isCarAccordionExpanded}
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
            <Typography>Автомобілі</Typography>

            {isCarAccordionExpanded ? (
              <IconButton
                sx={{ marginRight: "1rem" }}
                onClick={() => navigate(`/car/add/${userId}`)}
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
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <CarTableSkeletonRow
                      key={`skeleton-${i}`}
                      isFullSkeleton={isFullSkeleton}
                    />
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6" color="error">
                        Помилка завантаження: {error}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : !cars || cars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="h6">
                        У цього користувача нема автомобілів
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  cars.map((car) => (
                    <TableRow key={car.carID}>
                      <TableCell>{car.carID}</TableCell>
                      <TableCell>{car.firm}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.color}</TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>{car.licensePlate}</TableCell>
                      <TableCell>
                        {car.carPhotoURL && car.carPhotoURL.length > 0 ? (
                          <Avatar alt={car.carPhotoURL} src={car.carPhotoURL} />
                        ) : (
                          <Avatar alt="No car photo" src={NoCarPicture} />
                        )}
                      </TableCell>

                      <TableCell>
                        <IconButton
                          onClick={() => navigate(`/car/edit/${car.carID}`)}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCar(car);
                            setOpenDeleteModal(true);
                          }}
                          disabled={staff?.role !== "admin"}
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
