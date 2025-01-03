import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./userSlice";
import photoReducer from "./photoSlice";
import carReducer from "./carSlice";
import addressReducer from "./addressSlice";
import phoneReducer from "./phoneSlice";
import crimeReducer from "./criminalRecordSlice";
import authReducer from "./authSlice";
import themeReducer from "./themeSlice";
import historyReducer from "./historySlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme", "user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  photo: photoReducer,
  car: carReducer,
  address: addressReducer,
  phone: phoneReducer,
  crime: crimeReducer,
  auth: authReducer, // будет в localStorage
  theme: themeReducer, // будет в localStorage
  history: historyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
