import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "../types/addressTypes";
import { Resident } from "../types/residentTypes";
import axios, { AxiosError } from "axios";

export type AddressState = {
  addresses: Address[];
  loading: boolean;
  error: string | null;

  // жильці / Residents
  livingHistory: Resident[];
  livingLoading: boolean;
  livingError: string | null;
};

const initialState: AddressState = {
  addresses: [],
  loading: true,
  error: null,

  // жильці / Residents
  livingHistory: [],
  livingLoading: true,
  livingError: null,
};

export const getAllUsersAddresses = createAsyncThunk(
  "address/getAllUsersAddresses",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/Address/get-all/${userID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Помилка при отриманні адрес"
      );
    }
  }
);

export const getUserAddressByID = createAsyncThunk(
  "address/getUserAddressByID",
  async (
    { userID, addressID }: { userID?: string; addressID: number },
    { rejectWithValue }
  ) => {
    try {
      const link = userID
        ? `/api/Address/get-by-id/${addressID}/for-user/${userID}`
        : `/api/Address/get-by-id/${addressID}`;
      const response = await axios.get(link, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Помилка при отриманні адреси"
      );
    }
  }
);

export const getAddressLivingHistory = createAsyncThunk(
  "address/getAddressLivingHistory",
  async (addressID: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/Address/get-living-history/${addressID}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Помилка при отриманні исторії проживання"
      );
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (
    { addressID, address }: { addressID: number; address: Address },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `/api/Address/update/${addressID}`,
        address,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return { addressID, address: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Помилка при оновленні адреси"
      );
    }
  }
);

export const addAddressToUser = createAsyncThunk(
  "address/addAddressToUser",
  async (
    { userID, address }: { userID: string; address: Address },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/api/Address/add/${userID}`, address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      return { userID, address: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data ||
          "Помилка при додаванні адреси до користувача"
      );
    }
  }
);

export const removeAddressFromUser = createAsyncThunk(
  "address/removeAddressFromUser",
  async (
    { userID, addressID }: { userID: string; addressID: number },
    { rejectWithValue }
  ) => {
    try {
      await axios.delete(
        `/api/Address/remove/${addressID}/from-user/${userID}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return addressID;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data ||
          "Помилка при видаленні адреси із списка користувача"
      );
    }
  }
);

export const addExistingUserToAddress = createAsyncThunk(
  "address/addExistingUserToAddress",
  async (
    {
      addressID,
      userID,
      moveInDate,
      moveOutDate,
    }: {
      addressID: number;
      userID: string;
      moveInDate: string;
      moveOutDate: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      // Очистка значення moveOutDate
      const sanitizedMoveOutDate =
        moveOutDate?.trim() === "" ? null : moveOutDate;

      const response = await axios.post(
        `/api/Address/add-existing-user/${addressID}`,
        {
          userID,
          moveInDate,
          moveOutDate: sanitizedMoveOutDate, // NULL замість порожнього рядка
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data) {
        return rejectWithValue(
          "Помилка додавання користувача в історію проживання"
        );
      }

      return {
        userID,
        addressID,
        moveInDate,
        moveOutDate: sanitizedMoveOutDate,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data ||
          "Помилка додавання користувача в історію проживання"
      );
    }
  }
);

export const totalDeleteAddress = createAsyncThunk(
  "address/totalDeleteAddress",
  async (addressID: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/Address/total-delete/${addressID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return addressID;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Помилка повного видалення адреси"
      );
    }
  }
);

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsersAddresses.fulfilled,
        (state, action: PayloadAction<Address[] | undefined>) => {
          state.loading = false;
          state.error = null;
          state.addresses = action.payload ?? [];
        }
      )
      .addCase(getAllUsersAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося отримати адреси";
        state.addresses = [];
      })

      //========================================================================================

      .addCase(getUserAddressByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserAddressByID.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          state.error = null;
          const existingAddressIndex = state.addresses.findIndex(
            (address) => address.addressID === action.payload.addressID
          );
          if (existingAddressIndex !== -1) {
            state.addresses[existingAddressIndex] = action.payload;
          } else {
            state.addresses.push(action.payload);
          }
        }
      )
      .addCase(getUserAddressByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Не удалось загрузить адрес";
      })

      //========================================================================================

      .addCase(getAddressLivingHistory.pending, (state) => {
        state.livingLoading = true;
        state.livingError = null;
        state.livingHistory = [];
      })
      .addCase(
        getAddressLivingHistory.fulfilled,
        (state, action: PayloadAction<Resident[]>) => {
          state.livingLoading = false;
          state.livingError = null;
          state.livingHistory = action.payload;
        }
      )
      .addCase(getAddressLivingHistory.rejected, (state, action) => {
        state.livingLoading = false;
        state.livingError =
          action.error.message ?? "Не вдалося отримати мешканців за адресою";
        state.livingHistory = [];
      })

      //========================================================================================

      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAddress.fulfilled,
        (
          state,
          action: PayloadAction<
            { addressID: number; address: Address } | undefined
          >
        ) => {
          state.loading = false;
          if (action.payload) {
            const { addressID, address } = action.payload;
            const index = state.addresses.findIndex(
              (existingAddress) => existingAddress.addressID === addressID
            );
            if (index !== -1) {
              state.addresses[index] = address;
            }
          }
        }
      )
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося оновити адресу";
      })

      //========================================================================================
      .addCase(addAddressToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addAddressToUser.fulfilled,
        (
          state,
          action: PayloadAction<
            { userID: string; address: Address } | undefined
          >
        ) => {
          state.loading = false;
          if (action.payload) {
            const { address } = action.payload;
            state.addresses.push(address);
          }
        }
      )
      .addCase(addAddressToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося додати адресу";
      })

      //========================================================================================
      .addCase(removeAddressFromUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeAddressFromUser.fulfilled,
        (state, action: PayloadAction<number | undefined>) => {
          state.loading = false;
          state.error = null;
          state.addresses = state.addresses.filter(
            (address) => address.addressID !== action.payload
          );
        }
      )
      .addCase(removeAddressFromUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося видалити адресу";
      })

      //========================================================================================

      .addCase(addExistingUserToAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addExistingUserToAddress.fulfilled,
        (
          state,
          action: PayloadAction<
            | {
                userID: string;
                addressID: number;
                moveInDate: string;
                moveOutDate: string | null;
              }
            | undefined
          >
        ) => {
          state.loading = false;
          if (action.payload) {
            const { userID, moveInDate, moveOutDate } = action.payload;
            state.livingHistory.push({
              userID,
              moveInDate,
              moveOutDate,
            } as Resident);
          }
        }
      )
      .addCase(addExistingUserToAddress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Не вдалося прив'язати користувача до адреси";
      })

      //========================================================================================

      .addCase(totalDeleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        totalDeleteAddress.fulfilled,
        (state, action: PayloadAction<number | undefined>) => {
          state.loading = false;
          state.error = null;
          state.addresses = state.addresses.filter(
            (address) => address.addressID !== action.payload
          );
        }
      )
      .addCase(totalDeleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося видалити адресу";
      });
  },
});

export default addressSlice.reducer;
