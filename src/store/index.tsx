import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Define your state interface
export type RootState = ReturnType<typeof store.getState>; // Define your initial state here

const store = configureStore({
  reducer: {},
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector<RootState>;

export default store;
