import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Car } from "../types/carTypes";
import axios, { AxiosError } from "axios";

export type CarState = {
  cars: Car[];
  loading: boolean;
  error: string | null;
  carsCount?: number;
};

const initialState: CarState = {
  cars: [],
  loading: true,
  error: null,
  carsCount: 0,
};

export const getAllCars = createAsyncThunk(
  "car/getAllCars",
  async (
    {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    }: {
      pageNumber: number;
      pageSize: number;
      sortBy: string;
      sortDirection: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`/api/Car/get-all-cars`, {
        params: { pageNumber, pageSize, sortBy, sortDirection },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const getCarById = createAsyncThunk(
  "car/getCarById",
  async (carID: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/Car/get-by-id/${carID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const getAllUsersCars = createAsyncThunk(
  "car/getAllUsersCars",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/Car/get-all-users-cars/${userID}`,
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

export const searchCars = createAsyncThunk(
  "car/searchCars",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/Car/search-cars`, {
        params: { searchQuery },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const updateCar = createAsyncThunk(
  "car/updateCar",
  async ({ carID, car }: { carID: number; car: Car }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/Car/update/${carID}`, car, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      return { carID, car: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        return rejectWithValue("У вас недостатньо прав для редагування машин");
      }
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const addCarToUser = createAsyncThunk(
  "car/addCarToUser",
  async (
    { userID, car }: { userID: string; car: Car },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/api/Car/add/${userID}`, car, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      return { userID, car: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        return rejectWithValue("У вас недостатньо прав для додавання машин");
      }
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

export const deleteCar = createAsyncThunk(
  "car/deleteCar",
  async (carID: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/Car/delete/${carID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return carID;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        return rejectWithValue("У вас недостатньо прав для видалення машин");
      }
      return rejectWithValue(axiosError.response?.data || axiosError.message);
    }
  }
);

// HALPERS
export const getCarsCount = createAsyncThunk("car/getCarsCount", async () => {
  try {
    const response = await axios.get("/api/Car/quantity", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cars count:", error);
    throw error;
  }
});

const carSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(getAllCars.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося завантажити автомобілі";
      })

      //========================================================================================

      .addCase(getCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCarById.fulfilled, (state, action: PayloadAction<Car>) => {
        state.loading = false;
        state.error = null;
        state.cars = [action.payload];
      })
      .addCase(getCarById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Не вдалося завантажити автомобіль";
      })

      //========================================================================================

      .addCase(getAllUsersCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsersCars.fulfilled,
        (state, action: PayloadAction<Car[]>) => {
          state.loading = false;
          state.error = null;
          state.cars = action.payload;
        }
      )
      .addCase(getAllUsersCars.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Не вдалося завантажити автомобілі цього користувача";
      })

      //========================================================================================

      .addCase(searchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.loading = false;
        state.cars = action.payload;
        state.error = null;
      })
      .addCase(searchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалось знайти автомобілі";
      })

      //========================================================================================

      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCar.fulfilled,
        (
          state,
          action: PayloadAction<{ carID: number; car: Car } | undefined>
        ) => {
          state.loading = false;
          if (action.payload) {
            const { carID, car } = action.payload;
            const index = state.cars.findIndex(
              (existingCar) => existingCar.carID === carID
            );
            if (index !== -1) {
              state.cars[index] = car;
            }
          }
        }
      )
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Не вдалося оновити данні про автомобіль";
      })

      //========================================================================================

      .addCase(addCarToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCarToUser.fulfilled,
        (
          state,
          action: PayloadAction<{ userID: string; car: Car } | undefined>
        ) => {
          state.loading = false;
          if (action.payload) {
            const { car } = action.payload;
            state.cars.push(car);
          }
        }
      )
      .addCase(addCarToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося додати автомобіль";
      })

      //========================================================================================

      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCar.fulfilled,
        (state, action: PayloadAction<number | undefined>) => {
          state.loading = false;
          state.error = null;
          state.cars = state.cars.filter((car) => car.carID !== action.payload); // Видаляємо автомобіль зі списку
        }
      )
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося видалити автомобіль";
      })

      //========================================================================================
      // HALPERS

      .addCase(getCarsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCarsCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.carsCount = action.payload;
          state.error = null;
        }
      )
      .addCase(getCarsCount.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Не вдалося отримати загальну кількість автомобілів";
      });
  },
});

export default carSlice.reducer;
