import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { History } from "../types/historyTypes";
import axios, { AxiosError } from "axios";

export type HistoryState = {
  history: History[];
  loading: boolean;
  error: string | null;

  historyQuantity?: number;
};

const initialState: HistoryState = {
  history: [],
  loading: true,
  error: null,

  historyQuantity: 0,
};

export const GetAllSearchHistory = createAsyncThunk(
  "history/GetAllSearchHistory",
  async (
    { pageNumber, pageSize }: { pageNumber: number; pageSize: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/StaffSearchHistory/get-all-search-history?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

export const getCurrentStaffSearchHistory = createAsyncThunk(
  "user/getCurrentStaffSearchHistory",
  async (
    { pageNumber, pageSize }: { pageNumber: number; pageSize: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/StaffSearchHistory/get-current-staff-search-history/${localStorage.getItem(
          "staffID"
        )}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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

// HALPERS

export const getAllHistoryQuantity = createAsyncThunk(
  "history/getAllHistoryQuantity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/api/StaffSearchHistory/all-search-history-quantity",
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

export const getCurrentStaffSearchHistoryQantity = createAsyncThunk(
  "history/getCurrentStaffSearchHistoryQantity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/StaffSearchHistory/current-staff-search-history-quantity/${localStorage.getItem(
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
      .addCase(GetAllSearchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllSearchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(GetAllSearchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не удалось загрузить историю поиска";
      })

      //================================================================================
      .addCase(getCurrentStaffSearchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentStaffSearchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCurrentStaffSearchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не удалось загрузить историю поиска";
      })

      //HALPERS================================================================================

      .addCase(getAllHistoryQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHistoryQuantity.fulfilled, (state, action) => {
        state.historyQuantity = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllHistoryQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не удалось загрузить историю поиска";
      })

      //================================================================================

      .addCase(getCurrentStaffSearchHistoryQantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCurrentStaffSearchHistoryQantity.fulfilled,
        (state, action) => {
          state.historyQuantity = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        getCurrentStaffSearchHistoryQantity.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error.message || "Не удалось загрузить историю поиска";
        }
      );
  },
});

export default historySlice.reducer;
