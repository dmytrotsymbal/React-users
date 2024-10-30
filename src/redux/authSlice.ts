import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginDTO, Staff } from "../types/staffTypes";

export type AuthState = {
  staff: Staff | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean; // поле для отслеживания состояния входа
  token: string | null; // поле для токена
};

const initialState: AuthState = {
  staff: null,
  loading: false,
  error: null,
  isLoggedIn: false,
  token: localStorage.getItem("token"), // попытка загрузить токен из localStorage при инициализации
};

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginDTO, thunkAPI) => {
    try {
      const response = await axios.post("/api/Staff/login", loginData);

      const token = response.data.token; // Отримання токена з відповіді
      localStorage.setItem("token", token); // Збереження токена в localStorage

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.staff = null;
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
        state.isLoggedIn = true;
        state.token = action.payload.token; // сохраняем токен в состоянии
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
