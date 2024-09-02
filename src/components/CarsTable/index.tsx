import {
  Avatar,
  IconButton,
  Paper,
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
import { getAllCars } from "../../redux/carSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarTableSkeletonRow from "./CarTableSkeletonRow";

const CarsTable = () => {
  const dispatch = useAppDispatch();

  const { cars, loading, error } = useAppSelector(
    (state: RootState) => state.car
  );

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  const [isFullSkeleton] = useState<boolean>(true);

  return (
    <>
      <br />

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
            {loading ? (
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
                <TableCell colSpan={8}>Error: {error}</TableCell>
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
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   setSelectedUser(user);
                    //   setOpenDeleteModal(true);
                    // }}
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
    </>
  );
};
export default CarsTable;
