import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { getUserAddressByID } from "../../redux/addressSlice";
import { Grid, Paper, Button, Box, Skeleton } from "@mui/material";
import CustomErrorBlock from "../../components/ui/CustomErrorBlock";
import CustomIconButton from "../../components/ui/CustomIconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InteractiveMap from "../../components/InteractiveMap";

const AddressDetailsPage = () => {
  const { addressId } = useParams<{ addressId: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const address = useAppSelector((state: RootState) =>
    state.address.addresses.find((a) => a.addressID === Number(addressId))
  );

  const { loading, error } = useAppSelector(
    (state: RootState) => state.address
  );

  useEffect(() => {
    if (addressId) {
      dispatch(getUserAddressByID(Number(addressId)));
      console.log("СРАБОТАЛА ФУНКЦИЯ getUserAddressByID");
    }
  }, [dispatch, addressId]);

  // Перевірка, чи є координати
  const position =
    address && address.latitude && address.longitude
      ? [address.latitude, address.longitude]
      : new Error("Немає координат");

  return (
    <>
      <br />

      {error ? (
        <CustomErrorBlock />
      ) : (
        address && (
          <Paper
            elevation={3}
            sx={{ padding: "16px !important", position: "relative" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={9}>
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="350px"
                    height="35px"
                  />
                ) : (
                  <p>
                    Адресса: {address.streetAddress} {address.houseNumber}
                  </p>
                )}

                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="270px"
                    height="35px"
                  />
                ) : (
                  <p>Номер квартири: {address.apartmentNumber}</p>
                )}
              </Grid>

              <Grid
                item
                xs={3}
                sm={3}
                md={3}
                lg={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  alignItems: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "200px" }}
                  // onClick={() => navigate(`/user/edit/${user.userID}`)}
                >
                  Редагувати запис
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  sx={{ width: "200px" }}
                  // onClick={() => setOpenDeleteModal(true)}
                >
                  Видалити запис
                </Button>

                <CustomIconButton
                  icon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                />
              </Grid>
            </Grid>

            <br />
            <Box
              sx={{
                width: "100%",
                height: "650px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "1200px",
                  height: "50px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="370px"
                    height="35px"
                  />
                ) : (
                  <p>
                    Місто: {address.postalCode} {address.country}{" "}
                    {address.state} {address.city}
                  </p>
                )}

                {loading ? (
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="300px"
                    height="35px"
                  />
                ) : (
                  <p>
                    Координати: {address.latitude} {address.longitude}
                  </p>
                )}
              </Box>

              <br />

              {loading ? (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  width="1000px"
                  height="1200px"
                  sx={{
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <InteractiveMap position={position} />
              )}
            </Box>
          </Paper>
        )
      )}
    </>
  );
};
export default AddressDetailsPage;
