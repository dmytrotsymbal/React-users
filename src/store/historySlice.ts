import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { History } from "../types/historyTypes";
import axios, { AxiosError } from "axios";

export type HistoryState = {
  history: History[];
  loading: boolean;
  error: string | null;
};

const initialState: HistoryState = {
  history: [],
  loading: true,
  error: null,
};

export const getHistory = createAsyncThunk(
  "user/getHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/StaffSearchHistory/get-my-search-history`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Ошибка при получении данных"
      );
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не удалось загрузить историю поиска";
      });
  },
});

export default historySlice.reducer;
