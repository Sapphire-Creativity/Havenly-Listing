import { configureStore } from "@reduxjs/toolkit";
import savedReducer from "./savedSlice";

const loadState = () => {
  try {
    const serialized = localStorage.getItem("savedProperties");
    return serialized
      ? { saved: { items: JSON.parse(serialized) } }
      : undefined;
  } catch {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem(
      "savedProperties",
      JSON.stringify(state.saved.items)
    );
  } catch {
    // fail silently
  }
};

export const store = configureStore({
  reducer: {
    saved: savedReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});