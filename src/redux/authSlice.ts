import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginDTO, Staff } from "../types/staffTypes";

export type AuthState = {
  staff: Staff | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  staff: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

// Асинхронное действие для входа
export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginDTO, thunkAPI) => {
    try {
      const response = await axios.post("/api/Staff/login", loginData);
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
        state.staff = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
