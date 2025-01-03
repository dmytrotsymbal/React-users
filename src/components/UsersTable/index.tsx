import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getAllUsers,
  deleteUser,
  searchUsersByName,
  getUsersCount,
} from "../../store/userSlice";
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
  TableRow,
} from "@mui/material";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import NoProfilePicture from "../../assets/images/noProfilePicture.png";
import ConfirmDeleteUserModal from "../modals/ConfirmDeleteUserModal";
import { User } from "../../types/userTypes";
import useDebounce from "../../hooks/useDebounce";
import CustomSearchUsersInput from "../ui/CustomSearchUsersInput";
import CustomErrorBlock from "../ui/CustomErrorBlock";
import CustomNotFoundPaper from "../ui/CustomNotFoundPaper";
import CustomPagination from "../ui/CustomPagination";
import UserTableHead from "./UserTableHead";
import { formatDateTime } from "../../utils/formatDateTime";

const UsersTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const lightTheme = useAppSelector((state) => state.theme.lightTheme);

  const { users, loading, error, usersCount } = useAppSelector(
    (state: RootState) => state.user
  );

  const { staff } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getUsersCount()); // usersCount
  }, [dispatch]);

  const [isTyping, setIsTyping] = useState<boolean>(false); // идет ли набор текста
  const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для строки поиска
  const debouncedSearchQuery = useDebounce(searchQuery, 1500); // Используем дебаунс

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // параметри для getAllUsers
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;
  const totalPages = Math.ceil(Number(usersCount) / pageSize); // клво страниц
  const [sortBy, setSortBy] = useState<string>("UserID");
  const [sortDirection, setSortDirection] = useState<string>("asc");

  useEffect(() => {
    if (debouncedSearchQuery) {
      // Если строка поиска не пустая
      setIsTyping(false);
      dispatch(
        searchUsersByName({
          searchQuery: debouncedSearchQuery,
          minAge: undefined,
          maxAge: undefined,
          createdFrom: undefined,
          createdTo: undefined,
          onlyAdults: undefined,
          onlyWithPhoto: undefined,
        })
      );
    } else {
      setIsTyping(false);
      dispatch(
        getAllUsers({
          pageNumber: currentPage,
          pageSize,
          sortBy,
          sortDirection,
        })
      );
    }
  }, [debouncedSearchQuery, currentPage, dispatch, sortBy, sortDirection]);

  // Обработчик изменения значения строки поиска
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsTyping(true);
  };

  // очистка строки
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsTyping(false);
    dispatch(
      getAllUsers({ pageNumber: currentPage, pageSize, sortBy, sortDirection })
    );
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
    event.preventDefault();
    setCurrentPage(value);
  };

  // Обработчик сортировки
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

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
        <Button
          onClick={() => navigate("/user/add")}
          disabled={staff?.role !== "admin" && staff?.role !== "moderator"}
        >
          Додати користувача
        </Button>

        <CustomSearchUsersInput
          searchQuery={searchQuery}
          handleSearchInputChange={handleSearchInputChange}
          handleClearSearch={handleClearSearch}
          placeholder="Пошук користувачів"
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
            usersCount
          )}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <UserTableHead
            lightTheme={lightTheme}
            sortBy={sortBy}
            sortDirection={sortDirection as "asc" | "desc"}
            handleSort={handleSort}
          />

          <TableBody>
            {loading || isTyping ? (
              <>
                {Array.from({ length: 10 }).map((_, i) => (
                  <UserTableSkeletonRow key={`skeleton-${i}`} />
                ))}
              </>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <CustomErrorBlock />
                </TableCell>
              </TableRow>
            ) : users.length === 0 && searchQuery ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <CustomNotFoundPaper
                    errorMessage={`Користувача з іменем ${searchQuery} не знайдено`}
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.userID}
                  onClick={() => navigate(`/user/${user.userID}`)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <TableCell>{user.userID}</TableCell>
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
                  <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      disabled={staff?.role !== "admin"}
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
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Box>
      )}

      <br />
      <br />

      {selectedUser && (
        <ConfirmDeleteUserModal
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
