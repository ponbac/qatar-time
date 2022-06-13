import {
  configureStore,
  createListenerMiddleware,
  createSlice,
  ThunkAction,
} from "@reduxjs/toolkit";
import { Action } from "redux";
import { authSlice, signedIn } from "../features/auth/authSlice";

export const subjectSlice = createSlice({
  name: "subject",

  initialState: {} as any,

  reducers: {
    setEnt(state, action) {
      return action.payload;
    },
  },

  extraReducers: {
    
  },
});

const makeStore = () =>
  configureStore({
    reducer: {
      [subjectSlice.name]: subjectSlice.reducer,
      [authSlice.name]: authSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

const store = makeStore();
export default store;

export const fetchSubject =
  (id: any): AppThunk =>
  async (dispatch) => {
    const timeoutPromise = (timeout: number) =>
      new Promise((resolve) => setTimeout(resolve, timeout));

    await timeoutPromise(200);

    dispatch(
      subjectSlice.actions.setEnt({
        [id]: {
          id,
          name: `Subject ${id}`,
        },
      })
    );
  };

export const selectSubject = (id: any) => (state: AppState) =>
  state?.[subjectSlice.name]?.[id];
