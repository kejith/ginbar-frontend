import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { fetchAll, fetchById } from "../actions/actions";

const votesAdapter = createEntityAdapter({ selectId: (vote) => vote.id });

export const voteSlice = createSlice({
    name: "votes",
    initialState: votesAdapter.getInitialState(),
    reducers: {},
    extraReducers: {
        [fetchAll.fulfilled]: (state, action) => {
            // no votes found
            if (action.payload.vote === undefined) return;

            votesAdapter.upsertMany(
                state,
                Object.values(action.payload.vote)
            );
        },
        [fetchById.fulfilled]: (state, action) => {
            state.fetchState = "fulfilled";

            // no votes found
            if (action.payload.entities.vote === undefined) return;

            votesAdapter.upsertMany(
                state,
                Object.values(action.payload.entities.vote)
            );
        },
    },
});

export const votesReducer = voteSlice.reducer;

export const selectors = votesAdapter.getSelectors((state) => state.votes);
