import { createSlice } from "@reduxjs/toolkit";

type themeType = {
  lightTheme: boolean;
};

export const initialState: themeType = {
  lightTheme: true,
};

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.lightTheme = !state.lightTheme;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
