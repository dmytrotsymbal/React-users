import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "../types/addressTypes";
import { Resident } from "../types/residentTypes";

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
  async ({ userID, addressID }: { userID?: string; addressID: number }) => {
    try {
      let link: string;
      if (userID) {
        link = `/api/Address/get-by-id/${addressID}/for-user/${userID}`;
      } else {
        link = `/api/Address/get-by-id/${addressID}`; // Route without userID
      }

      const response = await fetch(link);

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

export const removeAddressFromUser = createAsyncThunk(
  "address/removeAddressFromUser",
  async ({ userID, addressID }: { userID: string; addressID: number }) => {
    try {
      const response = await fetch(
        `/api/Address/remove/${addressID}/from-user/${userID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return addressID;
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  }
);

export const addExistingUserToAddress = createAsyncThunk(
  "address/addExistingUserToAddress",
  async ({
    addressID,
    userID,
    moveInDate,
    moveOutDate,
  }: {
    addressID: number;
    userID: string;
    moveInDate: string;
    moveOutDate: string | null;
  }) => {
    try {
      const response = await fetch(
        `/api/Address/add-existing-user/${addressID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID, moveInDate, moveOutDate }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return { userID, addressID, moveInDate, moveOutDate };
    } catch (error) {
      console.error("Error adding existing user to address:", error);
    }
  }
);

export const totalDeleteAddress = createAsyncThunk(
  "address/totalDeleteAddress",
  async (addressID: number) => {
    try {
      const response = await fetch(`/api/Address/total-delete/${addressID}`, {
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
          const existingAddressIndex = state.addresses.findIndex(
            (address) => address.addressID === action.payload.addressID
          );
          if (existingAddressIndex !== -1) {
            state.addresses[existingAddressIndex] = action.payload; // Обновляем адрес, если уже существует
          } else {
            state.addresses.push(action.payload); // Добавляем адрес, если его еще нет
          }
        }
      )
      .addCase(getUserAddressByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Не удалось загрузить адрес";
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

      //================================================

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
          action.error.message ?? "Не удалось добавить пользователя";
      })

      //================================================

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
