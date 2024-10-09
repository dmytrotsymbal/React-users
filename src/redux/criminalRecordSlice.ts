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
  "criminalRecord/getAllUsersCriminalRecords",
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
      return response.data; // возвращаем только данные
    } catch (error) {
      console.error("Error fetching crime by ID:", error);
      throw error; // пробрасываем ошибку для обработки в редьюсере
    }
  }
);

export const updateCriminalRecord = createAsyncThunk(
  "criminalRecord/updateCriminalRecord",
  async ({
    criminalRecordID,
    criminalRecord,
  }: {
    criminalRecordID: number;
    criminalRecord: CriminalRecords;
  }) => {
    try {
      const response = await axios.put(
        `/api/CriminalRecord/update/${criminalRecordID}`,
        criminalRecord
      );
      return response.data;
    } catch (error) {
      console.error("Error updating crime:", error);
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

      //========================================================================================

      .addCase(getCriminalRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCriminalRecordById.fulfilled,
        (state, action: PayloadAction<CriminalRecords>) => {
          state.loading = false;
          state.error = null;
          // Прямо добавляем в criminalRecords как массив, заменяя старые данные
          state.criminalRecords = [action.payload];
        }
      )
      .addCase(getCriminalRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося завантажити кримінальний запис";
      })

      //========================================================================================
      .addCase(updateCriminalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCriminalRecord.fulfilled,
        (state, action: PayloadAction<CriminalRecords | undefined>) => {
          state.loading = false;
          if (action.payload) {
            const updatedCrime = action.payload;
            const index = state.criminalRecords.findIndex(
              (crime) =>
                crime.criminalRecordID === updatedCrime.criminalRecordID
            );
            if (index !== -1) {
              state.criminalRecords[index] = updatedCrime;
            }
          }
        }
      )
      .addCase(updateCriminalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Не вдалося оновити данні про кримінальний запис";
      });
  },
});

export default criminalRecordSlice.reducer;
