import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { fetchUser, updateUserData } from "../../utils/dataFetcher";
import { AppState, AppThunk } from "../../utils/store";

const initialPredictState: {
  predictions: Map<string, GroupPrediction> | null;
} = {
  predictions: null,
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
  },

  extraReducers: {},
});

// export const login =
//   (user: User): AppThunk =>
//   async (dispatch) => {
//     const playerUser = fetchUser(user.id).then((playerUser) => {
//       if (playerUser.name == null) {
//         updateUserData(
//           user.id,
//           user.user_metadata.full_name,
//           user.user_metadata.avatar_url,
//           "No cool description yet!"
//         );

//         playerUser.name = user.user_metadata.full_name;
//         playerUser.avatar = user.user_metadata.avatar_url;
//         playerUser.description = "No cool description yet!";
//       }

//       dispatch(signedIn(playerUser));
//     });
//   };

export default predictSlice.reducer;
export const { predictGroup } = predictSlice.actions;

export const selectGroupPredictions = (state: AppState) =>
  state.predict.predictions;
