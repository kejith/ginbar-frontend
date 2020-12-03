import {
    createEntityAdapter,
    createSlice,
    createSelector,
} from "@reduxjs/toolkit";
import { fetchById, postTagVoted, postTagCreated } from "../actions/actions";

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
        [postTagCreated.fulfilled]: (state, action) => {
            if (action.payload.entities === undefined) return;

            tagsAdapter.upsertMany(state, action.payload.entities.tags);
        },
        [postTagVoted.fulfilled]: (state, action) => {
            const { contentID, voteState } = action.payload;
            if (
                state.entities.length === 0 ||
                state.entities[contentID] === undefined
            )
                return;

            var scoreDiff = voteState - state.entities[contentID].upvoted;
            state.entities[contentID].upvoted = voteState;
            state.entities[contentID].score += scoreDiff;
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
