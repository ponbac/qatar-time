import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import {
  fetchUser,
  updateUserData,
  updateUserPredictions,
} from "../../utils/dataFetcher";
import { AppState, AppThunk } from "../../utils/store";

const initialPredictState: {
  predictions: Map<string, GroupPrediction> | null;
  isSaved: boolean | null;
} = {
  predictions: null,
  isSaved: null,
};

export const predictSlice = createSlice({
  name: "predict",

  initialState: initialPredictState,

  reducers: {
    predictGroup(state, action) {
      const groupId = action.payload.groupId;
      const groupPrediction = action.payload.groupPrediction;

      if (state.predictions == null) {
        state.predictions = new Map();
      }

      state.predictions.set(groupId, groupPrediction);
    },
    predictGame(state, action) {
      const groupId = action.payload.groupId;
      const gameId = action.payload.gameId;
      const gamePrediction = action.payload.gamePrediction;

      if (state.predictions == null) {
        state.predictions = new Map();
      }

      const groupPrediction = state.predictions.get(groupId);
      if (groupPrediction == null) {
        state.predictions.set(groupId, {
          groupId: groupId,
          games: [],
          result: [],
        });
      }

      if (groupPrediction && groupPrediction.games) {
        const games = groupPrediction.games;
        const gameIndex = games.findIndex((game) => game.id === gameId);
        if (gameIndex === -1) {
          games.push(gamePrediction);
        } else {
          games[gameIndex] = gamePrediction;
        }

        groupPrediction.games = games;
        state.predictions.set(groupId, groupPrediction);
      }
    },
    setSaved(state, action) {
      state.isSaved = action.payload;
    },
  },

  extraReducers: {},
});

export const savePredictions =
  (user: User, predictions: Map<string, GroupPrediction>): AppThunk =>
  async (dispatch) => {
    const playerUser = fetchUser(user.id).then((playerUser) => {
      updateUserPredictions(user.id, predictions);

      dispatch(setSaved(true));
    });
  };

export default predictSlice.reducer;
export const { predictGroup, setSaved } = predictSlice.actions;

export const selectGroupPredictions = (state: AppState) =>
  state.predict.predictions;
