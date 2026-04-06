import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    toggleSaved: (state, action) => {
      const exists = state.items.find((p) => p.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter((p) => p.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromSaved: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    clearSaved: (state) => {
      state.items = [];
    },
    // ✅ new — populates Redux from Supabase on login
    setSavedItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { toggleSaved, removeFromSaved, clearSaved, setSavedItems } = savedSlice.actions;

export const selectSavedItems = (state) => state.saved.items;
export const selectSavedCount = (state) => state.saved.items.length;
export const selectIsSaved = (propertyId) => (state) =>
  state.saved.items.some((p) => p.id === propertyId);

export default savedSlice.reducer;