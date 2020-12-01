import {
    createEntityAdapter,
    createSlice,
    createSelector,
} from "@reduxjs/toolkit";
import { fetchById } from "../actions/actions";

const tagsAdapter = createEntityAdapter({ selectId: (tag) => tag.id });

export const tagsSlice = createSlice({
    name: "tags",
    initialState: tagsAdapter.getInitialState(),
    reducers: {},
    extraReducers: {
        [fetchById.fulfilled]: (state, action) => {
            const { tags } = action.payload.entities;

            if (tags === undefined) return;

            tagsAdapter.upsertMany(state, tags);
        },
    },
});

export const tagsReducer = tagsSlice.reducer;
export const selectors = tagsAdapter.getSelectors((state) => state.tags);

const selectPropsPostId = (state, postId) => postId;
export const selectTagsByPostId = createSelector(
    [selectors.selectEntities, selectPropsPostId],
    (tagsEntities, postId) => {
        const tagsArray = Object.values(tagsEntities);
        return tagsArray.filter((tag) => tag.post_id === postId);
    }
);
