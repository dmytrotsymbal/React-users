import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Photo } from "../types/photoTypes";

export interface PhotoState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  photos: [],
  loading: true,
  error: null,
};

export const addPhoto = createAsyncThunk(
  "photo/addPhoto",
  async ({
    userID,
    photo,
  }: {
    userID: string;
    photo: Omit<Photo, "imageID">;
  }) => {
    const response = await fetch(`/api/Photo/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(photo),
    });
    if (!response.ok) {
      throw new Error("Failed to add photo");
    }
    return (await response.json()) as Photo;
  }
);

export const deletePhoto = createAsyncThunk(
  "photo/deletePhoto",
  async (imageID: string) => {
    const response = await fetch(`/api/Photo/${imageID}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete photo");
    }
    return imageID;
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
