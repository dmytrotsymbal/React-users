import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAllUsers,
  deleteUser,
  searchUsersByName,
  getUsersCount,
} from "../../redux/userSlice";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UserTableSkeletonRow from "./UserTableSkeletonRow";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Pagination,
} from "@mui/material";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import NoProfilePicture from "../../assets/noProfilePicture.webp";
import ConfirmDeleteModal from "../ui/modals/ConfirmDeleteUserModal";
import { User } from "../../types/userTypes";
import useDebounce from "../../hooks/useDebounce";

const UsersTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { users, loading, error, usersCount } = useAppSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(getUsersCount()); // usersCount
  }, [dispatch]);

  const [isTyping, setIsTyping] = useState<boolean>(false); // идет ли набор текста
  const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для строки поиска
  const debouncedSearchQuery = useDebounce(searchQuery, 1500); // Используем дебаунс

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const totalPages = Math.ceil(usersCount / pageSize); // клво страниц

  useEffect(() => {
    if (debouncedSearchQuery) {
      // Если строка поиска не пустая
      setIsTyping(false);
      dispatch(searchUsersByName(debouncedSearchQuery)); // Поиск по имени
    } else {
      // Если строка поиска пустая
      dispatch(getAllUsers({ pageNumber: currentPage, pageSize })); // Загрузка всех пользователей с пагинацией
    }
  }, [debouncedSearchQuery, currentPage, dispatch]);

  // Обработчик изменения значения строки поиска
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);
  };

  // очистка строки
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsTyping(false);
    dispatch(getAllUsers({ pageNumber: currentPage, pageSize }));
  };

  const handleDelete = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.userID));
      setOpenDeleteModal(false);
    }
  };

  // Обработчик изменения страницы пагинации
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value); // Обновляем текущую страницу
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

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
        <Button onClick={() => navigate("user/add")}>Додати користувача</Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Пошук користувачів"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchInputChange} // Обновляем строку поиска
          />

          <Button onClick={handleClearSearch}>Скасувати</Button>
        </Box>

        <Box
          sx={{
            width: "220px",
            fontSize: "1.2rem",
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
            usersCount
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
              <TableCell>User ID</TableCell>
              <TableCell>Фото</TableCell>
              <TableCell>Ім'я</TableCell>
              <TableCell>Прізвище</TableCell>
              <TableCell>Імейл</TableCell>
              <TableCell>Дата народження</TableCell>
              <TableCell>Створено</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading || isTyping ? (
              <>
                {Array.from({ length: 10 }).map((_, i) => (
                  <UserTableSkeletonRow key={`skeleton-${i}`} />
                ))}
              </>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8}>Error: {error}</TableCell>
              </TableRow>
            ) : users.length === 0 && searchQuery ? (
              <TableRow>
                <TableCell colSpan={8}>No users found</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.userID}
                  onClick={() => navigate(`/user/${user.userID}`)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <TableCell sx={{ maxWidth: "100px" }}>
                    {user.userID}
                  </TableCell>
                  <TableCell>
                    {user.photos?.length > 0 ? (
                      <Avatar
                        alt={user.photos[0].altText}
                        src={user.photos[0].imageURL}
                      />
                    ) : (
                      <Avatar alt="No profile image" src={NoProfilePicture} />
                    )}
                  </TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.dateOfBirth).toLocaleDateString("uk-UA")}
                    <br />(
                    {new Date().getFullYear() -
                      new Date(user.dateOfBirth).getFullYear()}{" "}
                    років)
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
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

      {selectedUser && (
        <ConfirmDeleteModal
          open={openDeleteModal}
          handleClose={() => setOpenDeleteModal(false)}
          handleDelete={handleDelete}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default UsersTable;
