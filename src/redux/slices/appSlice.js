import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
    volume: 1,
};

export const appSlice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        volumeChanged: (state, action) => {
            state.volume = action.payload;
        },
    },
    extraReducers: {},
});

export const selectVolume = createSelector(
    (state) => state.app,
    (app) => app.volume
);

export const appReducer = appSlice.reducer;
export const { volumeChanged } = appSlice.actions;
