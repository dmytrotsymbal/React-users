import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import photoReducer from "./photoSlice";
import carReducer from "./carSlice";
import adressReducer from "./addressSlice";
import phoneReducer from "./phoneSlice";
import crimeReducer from "./criminalRecordSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    photo: photoReducer,
    car: carReducer,
    address: adressReducer,
    phone: phoneReducer,
    crime: crimeReducer,

    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
