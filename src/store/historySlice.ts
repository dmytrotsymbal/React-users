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

export const getAllHistory = createAsyncThunk(
  "history/getAllHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/StaffSearchHistory/get-all-history-search",
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

export const getHistoryOfUser = createAsyncThunk(
  "user/getHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/StaffSearchHistory/get-my-search-history/${localStorage.getItem(
          "staffID"
        )}`,
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
      .addCase(getAllHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не удалось загрузить историю поиска";
      })
      .addCase(getHistoryOfUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHistoryOfUser.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getHistoryOfUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не удалось загрузить историю поиска";
      });
  },
});

export default historySlice.reducer;
