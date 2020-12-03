import {
    createEntityAdapter,
    createSlice,
    createSelector,
} from "@reduxjs/toolkit";
import { userChecked, userLoggedIn, userLoggedOut } from "../actions/actions";

const usersAdapter = createEntityAdapter({ selectId: (user) => user.id });

export const usersSlice = createSlice({
    name: "users",
    initialState: usersAdapter.getInitialState({
        loginSuccessfull: false,
        currentUser: null,
    }),
    reducers: {},
    extraReducers: {
        [userLoggedIn.fulfilled]: (state, action) => {
            var users = Object.values(action.payload.entities);
            if (action.payload.entities === undefined || users.length !== 1)
                return;

            usersAdapter.upsertMany(state, users);
            state.loginSuccessfull = true;
            state.currentUser =
                action.payload.entities.users[action.payload.result];
        },
        [userLoggedIn.rejected]: (state, action) => {
            state.loginSuccessfull = false;
            state.currentUser = null;
        },
        [userChecked.fulfilled]: (state, action) => {
            var users = Object.values(action.payload.entities);
            if (action.payload.entities === undefined && users.length !== 1)
                return;

            usersAdapter.upsertMany(state, action.payload.entities.users);
            state.currentUser =
                action.payload.entities.users[action.payload.result];
        },
        [userChecked.rejected]: (state, action) => {
            state.currentUser = null;
        },
        [userLoggedOut.fulfilled]: (state, action) => {
            state.currentUser = null;
        },
    },
});

export const selectLoginStatus = createSelector(
    (state) => state.users,
    (users) => users.currentUser !== null
);

export const usersReducer = usersSlice.reducer;
export const selectors = usersAdapter.getSelectors((state) => state.users);
