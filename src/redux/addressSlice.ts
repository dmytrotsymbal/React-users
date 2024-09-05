import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "../types/addressTypes";

export interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: true,
  error: null,
};

export const getAllUsersAddresses = createAsyncThunk(
  "address/getAllUsersAddresses",
  async (userID: string) => {
    try {
      const response = await fetch(
        `/api/Address/GetAllUsersAddresses/${userID}`
      );
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
      const response = await fetch(
        `/api/Address/GetUserAddressById/${addressID}`
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
      const response = await fetch(`/api/Address/UpdateAddress/${addressID}`, {
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
              state.addresses[index] = address; // Оновлюємо автомобіль в списку
            }
          }
        }
      )
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update car";
      })

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
