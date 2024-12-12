import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { LoginDTO, Staff } from "../types/staffTypes";

export type AuthState = {
  staff: Staff | null;
  role: string | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean; // поле для отслеживания состояния входа
  token: string | null; // поле для токена
};

const initialState: AuthState = {
  staff: null,
  role: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  token: localStorage.getItem("token"), // попытка загрузить токен из localStorage при инициализации
};

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/Staff/login", loginData);

      const token = response.data.token; // Отримання токена з відповіді
      localStorage.setItem("token", token); // Збереження токена в localStorage

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.staff = null;
      state.role = null;
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem("token"); // удаляем токен из localStorage при логауте
      localStorage.clear(); // очищаем localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.staff = {
          staffID: action.payload.staffID,
          nickname: action.payload.nickname,
          role: action.payload.role,
          createdAt: action.payload.createdAt,
          email: action.payload.email,
        };
        state.role = action.payload.role;
        state.isLoggedIn = true;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
