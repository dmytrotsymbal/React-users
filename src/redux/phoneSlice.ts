import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Phone } from "../types/phoneTypes";
import axios from "axios";

export type PhoneState = {
  phones: Phone[];
  loading: boolean;
  error: string | null;
};

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
        `/api/Phone/get-all-users-phones/${userID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching phones:", error);
      throw error;
    }
  }
);

export const getPhoneById = createAsyncThunk(
  "phone/getPhoneById",
  async (phoneID: number) => {
    try {
      const response = await axios.get(`/api/Phone/get-phone-by-id/${phoneID}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching phone:", error);
      throw error;
    }
  }
);

export const updatePhone = createAsyncThunk(
  "phone/updatePhone",
  async ({ phoneID, phone }: { phoneID: number; phone: Phone }) => {
    try {
      const response = await axios.put(
        `/api/Phone/update-phone/${phoneID}`,
        phone
      );
      return response.data;
    } catch (error) {
      console.error("Error updating phone:", error);
      throw error;
    }
  }
);

export const addPhoneToUser = createAsyncThunk(
  "phone/addPhoneToUser",
  async ({ userID, phone }: { userID: string; phone: Phone }) => {
    try {
      const response = await axios.post(
        `/api/Phone/add-phone-to/${userID}`,
        phone
      );
      return response.data;
    } catch (error) {
      console.error("Error adding phone to user:", error);
      throw error;
    }
  }
);

export const deletePhone = createAsyncThunk(
  "phone/deletePhone",
  async (phoneID: number) => {
    try {
      const response = await axios.delete(`/api/Phone/delete-phone/${phoneID}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting phone:", error);
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
      })

      .addCase(getPhoneById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPhoneById.fulfilled,
        (state, action: PayloadAction<Phone>) => {
          state.loading = false;
          state.error = null;
          state.phones = [action.payload];
        }
      )
      .addCase(getPhoneById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Не вдалося завантажити номер телефону";
      })

      .addCase(updatePhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePhone.fulfilled,
        (state, action: PayloadAction<Phone | undefined>) => {
          state.loading = false;
          if (action.payload) {
            const updatedPhone = action.payload;
            const index = state.phones.findIndex(
              (phone) => phone.phoneID === updatedPhone.phoneID
            );
            if (index !== -1) {
              state.phones[index] = updatedPhone;
            }
          }
        }
      )
      .addCase(updatePhone.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Не вдалося оновити данні цього номер телефону";
      })

      .addCase(addPhoneToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addPhoneToUser.fulfilled,
        (
          state,
          action: PayloadAction<{ userID: string; phone: Phone } | undefined>
        ) => {
          state.loading = false;
          if (action.payload) {
            const { phone } = action.payload;
            state.phones.push(phone);
          }
        }
      )
      .addCase(addPhoneToUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Не вдалося додати номер телефону до користувача";
      })

      .addCase(deletePhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deletePhone.fulfilled,
        (state, action: PayloadAction<number | undefined>) => {
          state.loading = false;
          state.error = null;
          state.phones = state.phones.filter(
            (phone) => phone.phoneID !== action.payload
          );
        }
      )
      .addCase(deletePhone.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Не вдалося видалити цей номер телефону";
      });
  },
});

export default phoneSlice.reducer;
