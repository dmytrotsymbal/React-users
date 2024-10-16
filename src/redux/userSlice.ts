import { User, UserDTO } from "../types/userTypes";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type UserState = {
  users: User[];
  loading: boolean;
  error: string | null;
  usersCount?: number;

  usersIDs: string[]; // ids array
};

const initialState: UserState = {
  users: [],
  loading: true,
  error: null,
  usersCount: 0,

  usersIDs: [], // ids array
};

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async ({
    pageNumber,
    pageSize,
  }: {
    pageNumber: number;
    pageSize: number;
  }) => {
    try {
      const response = await fetch(
        `/api/User?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userID: string) => {
    try {
      const response = await fetch(`/api/User/${userID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
);

export const searchUsersByName = createAsyncThunk(
  "user/searchUsersByName",
  async (searchQuery: string) => {
    try {
      const response = await fetch(
        `/api/User/search?searchQuery=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (user: UserDTO, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userID, user }: { userID: string; user: User }) => {
    const response = await fetch(`/api/User/${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return { userID, user };
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userID: string) => {
    const response = await fetch(`/api/User/${userID}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return userID;
  }
);

// HALPERS

export const getUsersCount = createAsyncThunk(
  "user/getUsersCount",
  async () => {
    try {
      const response = await fetch("/api/User/quantity");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users count:", error);
    }
  }
);

export const getAllUsersIDs = createAsyncThunk(
  "user/getAllUsersIDs",
  async () => {
    try {
      const response = await fetch("/api/User/get-all-ids");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users IDs:", error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося отримати користувачів";
      })

      //========================================================================================

      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users = [action.payload];
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Не вдалося отримати користувача";
      })

      //========================================================================================

      .addCase(searchUsersByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchUsersByName.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
          state.error = null;
        }
      )
      .addCase(searchUsersByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося знайти користувача";
      })

      //========================================================================================

      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося створити нового користувача";
      })

      //========================================================================================

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.userID === action.payload.userID
        );
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося ононовити данні користувача";
      })

      //========================================================================================

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.userID !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Не вдалося видалити користувача";
      })

      //========================================================================================

      .addCase(getUsersCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUsersCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.usersCount = action.payload;
          state.error = null;
        }
      )
      .addCase(getUsersCount.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Не вдалося отримати загальну кількість користувачів";
      })

      //========================================================================================

      .addCase(getAllUsersIDs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsersIDs.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.usersIDs = action.payload;
          state.error = null;
        }
      )
      .addCase(getAllUsersIDs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося отримати список ID користувачів";
      });
  },
});

export default userSlice.reducer;
