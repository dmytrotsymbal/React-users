import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Phone } from "../types/phoneTypes";
import axios from "axios";

export interface PhoneState {
  phones: Phone[];
  loading: boolean;
  error: string | null;
}

const initialState: PhoneState = {
  phones: [],
  loading: true,
  error: null,
};

export const getAllUsersPhones = createAsyncThunk(
  "phone/getAllUsersPhones",
  async (userID: string) => {
    try {
      const response = await axios.get(
        `/api/Phone/GetAllUsersPhones/${userID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching phones:", error);
      throw error;
    }
  }
);

export const phoneSlice = createSlice({
  name: "phone",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersPhones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsersPhones.fulfilled,
        (state, action: PayloadAction<Phone[] | undefined>) => {
          state.loading = false;
          state.error = null;
          state.phones = action.payload ?? [];
        }
      )
      .addCase(getAllUsersPhones.rejected, (state, action) => {
        state.phones = [];
        state.loading = false;
        state.error =
          action.error.message ||
          "Не вдалося отримати телефони цього користувача";
      });
  },
});

export default phoneSlice.reducer;
