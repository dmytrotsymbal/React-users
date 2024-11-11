import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Photo } from "../types/photoTypes";
import axios, { AxiosError } from "axios";

export type PhotoState = {
  photos: Photo[];
  loading: boolean;
  error: string | null;
};

const initialState: PhotoState = {
  photos: [],
  loading: true,
  error: null,
};

export const addPhoto = createAsyncThunk(
  "photo/addPhoto",
  async (
    {
      userID,
      photo,
    }: {
      userID: string;
      photo: Omit<Photo, "imageID">;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/api/Photo/${userID}`, photo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      return response.data as Photo;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Failed to add photo"
      );
    }
  }
);

export const deletePhoto = createAsyncThunk(
  "photo/deletePhoto",
  async (imageID: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/Photo/${imageID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response) {
        throw new Error("Network response was not ok");
      }
      return imageID;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(
        axiosError.response?.data || "Failed to delete photo"
      );
    }
  }
);

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.loading = false;
        state.photos.push(action.payload);
      })
      .addCase(addPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не вдалося додати фото до користувача";
      })

      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deletePhoto.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.photos = state.photos.filter(
            (photo) => photo.imageID.toString() !== action.payload
          );
        }
      )
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Не вдалось видалити фото користувача";
      });
  },
});

export default photoSlice.reducer;
