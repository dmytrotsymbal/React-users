import {
  Avatar,
  Box,
  IconButton,
  Pagination,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import NoProfilePicture from "../../assets/noProfilePicture.webp";
import { RootState } from "../../redux/store";
import {
  deleteCar,
  getAllCars,
  getCarsCount,
  searchCars,
} from "../../redux/carSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarTableSkeletonRow from "./CarTableSkeletonRow";
import useDebounce from "../../hooks/useDebounce";
import CustomSearchInput from "../ui/CustomSearchInput";
import CustomErrorBlock from "../ui/CustomErrorBlock";
import CustomNotFoundPaper from "../ui/CustomNotFoundPaper";
import { Car } from "../../types/carTypes";
import ConfirmDeleteCarModal from "../ui/modals/ConfirmDeleteCarModal";

const CarsTable = () => {
  const dispatch = useAppDispatch();

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const { cars, loading, error, carsCount } = useAppSelector(
    (state: RootState) => state.car
  );

  useEffect(() => {
    dispatch(getCarsCount());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;
  const totalPages = Math.ceil(Number(carsCount) / pageSize);

  useEffect(() => {
    if (debouncedSearchQuery) {
      // Если строка поиска не пустая
      setIsTyping(false);
      dispatch(searchCars(debouncedSearchQuery));
    } else {
      setIsTyping(false);
      dispatch(getAllCars({ pageNumber: currentPage, pageSize }));
    }
  }, [dispatch, debouncedSearchQuery, currentPage]);

  //=========================================

  const handleDelete = () => {
    if (selectedCar) {
      dispatch(deleteCar(selectedCar.carID));
      setOpenDeleteModal(false);
    }
  };

  //=========================================
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  //=========================================

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
    setIsTyping(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsTyping(false);
    dispatch(getAllCars({ pageNumber: currentPage, pageSize }));
  };

  const [isFullSkeleton] = useState<boolean>(true);

  return (
    <>
      <br />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "50px",
          marginBottom: "16px",
        }}
      >
        <CustomSearchInput
          searchQuery={searchQuery}
          handleSearchInputChange={handleSearchInputChange}
          handleClearSearch={handleClearSearch}
          placeholder="Пошук машини по номеру або марці"
        />

        <Box
          sx={{
            width: "220px",
            fontSize: "14px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          Кількість записів :{" "}
          {loading ? (
            <Skeleton
              animation="wave"
              height={35}
              variant="text"
              width={30}
              sx={{
                display: "inline-block",
                alignItems: "center",
              }}
            />
          ) : (
            carsCount
          )}
        </Box>
      </Box>
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
              <TableCell>User ID</TableCell>
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
            {loading || isTyping ? (
              <>
                {Array.from({ length: 15 }).map((_, i) => (
                  <CarTableSkeletonRow
                    key={`skeleton-${i}`}
                    isFullSkeleton={isFullSkeleton}
                  />
                ))}
              </>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <CustomErrorBlock />
                </TableCell>
              </TableRow>
            ) : cars.length === 0 && searchQuery ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <CustomNotFoundPaper
                    errorMessage={`Машини з назвою ${searchQuery} не знайдено`}
                  />
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow key={car.carID}>
                  <TableCell sx={{ maxWidth: "100px" }}>{car.carID}</TableCell>

                  <TableCell>
                    <Link to={`/user/${car.userID}`}> {car.userID} </Link>{" "}
                  </TableCell>
                  <TableCell>{car.firm}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.color}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>{car.licensePlate}</TableCell>

                  <TableCell>
                    {car.carPhotoURL?.length > 0 ? (
                      <Avatar
                        alt={`${car.firm} ${car.model}`}
                        src={car.carPhotoURL}
                      />
                    ) : (
                      <Avatar alt="No profile image" src={NoProfilePicture} />
                    )}
                  </TableCell>

                  <TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!searchQuery && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
        >
          <Pagination
            count={totalPages} // Общее количество страниц
            page={currentPage} // Текущая страница
            onChange={handlePageChange} // Обработчик смены страницы
            color="primary"
          />
        </Box>
      )}

      <br />
      <br />

      {selectedCar && (
        <ConfirmDeleteCarModal
          open={openDeleteModal}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={handleDelete}
          car={selectedCar}
        />
      )}
    </>
  );
};
export default CarsTable;
