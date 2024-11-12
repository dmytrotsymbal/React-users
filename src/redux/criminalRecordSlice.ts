import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CriminalRecords, Prison } from "../types/criminalRecordsTypes";
import axios, { AxiosError } from "axios";

export type CriminalRecordsState = {
  criminalRecords: CriminalRecords[];
  loading: boolean;
  error: string | null;

  prisonsList: Prison[];
};

const initialState: CriminalRecordsState = {
  criminalRecords: [],
  loading: true,
  error: null,

  prisonsList: [],
};

export const getAllUsersCriminalRecords = createAsyncThunk(
  "criminalRecord/getAllUsersCriminalRecords",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/CriminalRecord/get-all-users-crimes/${userID}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const getCriminalRecordById = createAsyncThunk(
  "criminalRecord/getCriminalRecordById",
  async (criminalRecordID: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/CriminalRecord/get-crime-by-id/${criminalRecordID}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const updateCriminalRecord = createAsyncThunk(
  "criminalRecord/updateCriminalRecord",
  async (
    {
      criminalRecordID,
      criminalRecord,
    }: {
      criminalRecordID: number;
      criminalRecord: CriminalRecords;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `/api/CriminalRecord/update/${criminalRecordID}`,
        criminalRecord,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const addCriminalRecordToUser = createAsyncThunk(
  "criminalRecord/addCriminalRecordToUser",
  async (
    {
      userID,
      criminalRecord,
    }: {
      userID: string;
      criminalRecord: CriminalRecords;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `/api/CriminalRecord/add-crime-to/${userID}`,
        criminalRecord,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const deleteCriminalRecord = createAsyncThunk(
  "criminalRecord/deleteCriminalRecord",
  async (criminalRecordID: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/api/CriminalRecord/delete/${criminalRecordID}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

//HALPERS=================================================

export const getAllPrisons = createAsyncThunk(
  "criminalRecord/getAllPrisons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/CriminalRecord/get-all-prisons", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
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
      })

      .addCase(addCriminalRecordToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCriminalRecordToUser.fulfilled,
        (
          state,
          action: PayloadAction<
            { userID: string; criminalRecord: CriminalRecords } | undefined
          >
        ) => {
          state.loading = false;
          if (action.payload) {
            const { criminalRecord } = action.payload;
            state.criminalRecords.push(criminalRecord);
          }
        }
      )
      .addCase(addCriminalRecordToUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Не вдалося додати кримінальний запис до користувача";
      })

      .addCase(deleteCriminalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCriminalRecord.fulfilled,
        (state, action: PayloadAction<number | undefined>) => {
          state.loading = false;
          state.error = null;
          state.criminalRecords = state.criminalRecords.filter(
            (crime) => crime.criminalRecordID !== action.payload
          );
        }
      )
      .addCase(deleteCriminalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Не вдалося видалити кримінальний запис";
      })

      //========================================================================================

      .addCase(getAllPrisons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllPrisons.fulfilled,
        (state, action: PayloadAction<Prison[] | undefined>) => {
          state.loading = false;
          state.error = null;
          state.prisonsList = action.payload ?? [];
        }
      )
      .addCase(getAllPrisons.rejected, (state, action) => {
        state.prisonsList = [];
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося отримати список всіх ув'язнених";
      });
  },
});

export default criminalRecordSlice.reducer;
