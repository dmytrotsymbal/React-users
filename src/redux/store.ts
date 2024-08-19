import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import photoReducer from "./photoSlice";
import carReducer from "./carSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    photo: photoReducer,
    car: carReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
