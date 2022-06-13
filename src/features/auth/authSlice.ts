import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { AppState } from "../../utils/store";

const initialAuthState: { isAuthenticated: boolean; user: User | null } = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",

  initialState: initialAuthState,

  reducers: {
    signedIn(state, action) {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    },
    signedOut(state) {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    },
  },

  extraReducers: {},
});

export default authSlice.reducer;

export const { signedIn, signedOut } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;
export const selectUser = (state: AppState) => selectAuthState(state).user;
