import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Car } from "../types/carTypes";

export interface CarState {
  cars: Car[];
  loading: boolean;
  error: string | null;
  carsCount?: number;
}

const initialState: CarState = {
  cars: [],
  loading: true,
  error: null,
  carsCount: 0,
};

export const getAllCars = createAsyncThunk(
  "car/getAllCars",
  async ({
    pageNumber,
    pageSize,
  }: {
    pageNumber: number;
    pageSize: number;
  }) => {
    try {
      const response = await fetch(
        `/api/Car/get-all-cars?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  }
);

export const getCarById = createAsyncThunk(
  "car/getCarById",
  async (carID: number) => {
    try {
      const response = await fetch(`/api/Car/get-by-id/${carID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching car:", error);
    }
  }
);

export const getAllUsersCars = createAsyncThunk(
  "car/getAllUsersCars",
  async (userID: string) => {
    try {
      const response = await fetch(`/api/Car/get-all-users-cars/${userID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }
);

export const searchCars = createAsyncThunk(
  "car/searchCars",
  async (searchQuery: string) => {
    try {
      const response = await fetch(
        `/api/Car/search-cars?searchQuery=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }
);

export const updateCar = createAsyncThunk(
  "car/updateCar",
  async ({ carID, car }: { carID: number; car: Car }) => {
    try {
      const response = await fetch(`/api/Car/update/${carID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(car),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return { carID, car };
    } catch (error) {
      console.error("Error updating car:", error);
    }
  }
);

export const addCarToUser = createAsyncThunk(
  "car/addCarToUser",
  async ({ userID, car }: { userID: string; car: Car }) => {
    try {
      const response = await fetch(`/api/Car/add/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(car),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return { userID, car };
    } catch (error) {
      console.error("Error adding car to user:", error);
    }
  }
);

export const deleteCar = createAsyncThunk(
  "car/deleteCar",
  async (carID: number) => {
    try {
      const response = await fetch(`/api/Car/delete/${carID}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return carID;
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  }
);

// HALPERS
export const getCarsCount = createAsyncThunk("car/getCarsCount", async () => {
  try {
    const response = await fetch("/api/Car/quantity");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cars count:", error);
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
        state.loading = false; // Знімаємо стан лоадінгу
        state.cars = action.payload; // Зберігаємо отриманих користувачів
      })
      .addCase(getAllCars.rejected, (state, action) => {
        state.loading = false; // Знімаємо стан лоадінгу
        state.error =
          action.error.message || "Не вдалося завантажити автомобілі"; // Встановлюємо помилку
      })

      //|=|=|=|=|=|=|=|=|=|=|=|
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

      //|=|=|=|=|=|=|=|=|=|=|=|
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

      //|=|=|=|=|=|=|=|=|=|=|=|
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

      //|=|=|=|=|=|=|=|=|=|=|=|
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
              state.cars[index] = car; // Оновлюємо автомобіль в списку
            }
          }
        }
      )
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Не вдалося оновити данні про автомобіль";
      })

      //|=|=|=|=|=|=|=|=|=|=|=|
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
            state.cars.push(car); // Додаємо автомобіль до списку
          }
        }
      )
      .addCase(addCarToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Не вдалося додати автомобіль";
      })

      //|=|=|=|=|=|=|=|=|=|=|=|
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

      // HALPERS |=|=|=|=|=|=|=|=|=|=|=|
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
