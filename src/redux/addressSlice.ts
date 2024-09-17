import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "../types/addressTypes";
import { Resident } from "../types/helpers/residentTypes";

export interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;

  // жильці
  livingHistory: Resident[];
  livingLoading: boolean;
  livingError: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: true,
  error: null,

  // жильці
  livingHistory: [],
  livingLoading: true,
  livingError: null,
};

export const getAllUsersAddresses = createAsyncThunk(
  "address/getAllUsersAddresses",
  async (userID: string) => {
    try {
      const response = await fetch(`/api/Address/get-all/${userID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }
);

export const getUserAddressByID = createAsyncThunk(
  "address/getUserAddressByID",
  async (addressID: number) => {
    try {
      const response = await fetch(`/api/Address/get-by-id/${addressID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }
);

export const getAddressLivingHistory = createAsyncThunk(
  "address/getAddressLivingHistory",
  async (addressID: number) => {
    try {
      const response = await fetch(
        `/api/Address/get-living-history/${addressID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ addressID, address }: { addressID: number; address: Address }) => {
    try {
      const response = await fetch(`/api/Address/update/${addressID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return { addressID, address };
    } catch (error) {
      console.error("Error updating address:", error);
    }
  }
);

export const addAddressToUser = createAsyncThunk(
  "address/addAddressToUser",
  async ({ userID, address }: { userID: string; address: Address }) => {
    try {
      const response = await fetch(`/api/Address/add/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return { userID, address };
    } catch (error) {
      console.error("Error adding address to user:", error);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressID: number) => {
    try {
      const response = await fetch(`/api/Address/DeleteAddress/${addressID}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return addressID;
    } catch (error) {
      console.error("Error deleting address:", error);
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
        state.addresses = []; // Встановлюємо пустий масив при помилці
      })

      //================================================

      .addCase(getUserAddressByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserAddressByID.fulfilled,
        (state, action: PayloadAction<Address>) => {
          state.loading = false;
          state.error = null;
          state.addresses = [action.payload];
        }
      )
      .addCase(getUserAddressByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося отримати адреси";
        state.addresses = []; // Встановлюємо пустий масив при помилці
      })

      //================================================

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

      //================================================

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
        state.error = action.error.message ?? "Failed to update car";
      })

      //================================================

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

      //================================================

      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAddress.fulfilled,
        (state, action: PayloadAction<number | undefined>) => {
          state.loading = false;
          state.error = null;
          state.addresses = state.addresses.filter(
            (address) => address.addressID !== action.payload
          ); // Видаляємо адресу зі списку
        }
      )
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося видалити адресу";
      });
  },
});

export default addressSlice.reducer;
