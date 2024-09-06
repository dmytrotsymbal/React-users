import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import photoReducer from "./photoSlice";
import carReducer from "./carSlice";
import adressReducer from "./addressSlice";
import phoneReducer from "./phoneSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    photo: photoReducer,
    car: carReducer,
    address: adressReducer,
    phone: phoneReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
