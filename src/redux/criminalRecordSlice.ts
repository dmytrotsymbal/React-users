import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CriminalRecords } from "../types/criminalRecordsTypes";
import axios from "axios";

export type CriminalRecordsState = {
  criminalRecords: CriminalRecords[];
  loading: boolean;
  error: string | null;
};

const initialState: CriminalRecordsState = {
  criminalRecords: [],
  loading: true,
  error: null,
};

export const getAllUsersCriminalRecords = createAsyncThunk(
  "phone/getAllUsersCriminalRecords",
  async (userID: string) => {
    try {
      const response = await axios.get(
        `/api/CriminalRecord/get-all-users-crimes/${userID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users crimes:", error);
      throw error;
    }
  }
);

export const getCriminalRecordById = createAsyncThunk(
  "criminalRecord/getCriminalRecordById",
  async (criminalRecordID: number) => {
    try {
      const response = await axios.get(
        `/api/CriminalRecord/get-crime-by-id/${criminalRecordID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching crime by ID:", error);
      throw error;
    }
  }
);

export const criminalRecordSlice = createSlice({
  name: "criminalRecord",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersCriminalRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsersCriminalRecords.fulfilled,
        (state, action: PayloadAction<CriminalRecords[] | undefined>) => {
          state.loading = false;
          state.error = null;
          state.criminalRecords = action.payload ?? [];
        }
      )
      .addCase(getAllUsersCriminalRecords.rejected, (state, action) => {
        state.criminalRecords = [];
        state.loading = false;
        state.error =
          action.error.message ||
          "Не вдалося отримати кримінальні записи цього користувача";
      })

      .addCase(getCriminalRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCriminalRecordById.fulfilled,
        (state, action: PayloadAction<CriminalRecords>) => {
          state.loading = false;
          state.error = null;
          state.criminalRecords = [action.payload];
        }
      )
      .addCase(getCriminalRecordById.rejected, (state, action) => {
        state.criminalRecords = [];
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося отримати кримінальний запис";
      });
  },
});

export default criminalRecordSlice.reducer;
