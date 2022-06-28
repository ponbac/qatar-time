import {
  configureStore,
  createListenerMiddleware,
  createSlice,
  ThunkAction,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Action } from "redux";
import { enableMapSet } from 'immer';
import { authSlice, signedIn } from "../features/auth/authSlice";
import { predictSlice } from "../features/predict/predictSlice";

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
      [predictSlice.name]: predictSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

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
