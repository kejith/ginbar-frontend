import {
    createEntityAdapter,
    createSlice,
    createSelector,
} from "@reduxjs/toolkit";
import { fetchAll, fetchById, commentVoted, commentCreated } from "../actions/actions";

const commentsAdapter = createEntityAdapter({
    selectId: (comment) => comment.id,
});

export const commentSlice = createSlice({
    name: "comments",
    initialState: commentsAdapter.getInitialState({
        createdCommentID: 0,
    }),
    reducers: {},
    extraReducers: {
        [fetchAll.fulfilled]: (state, action) => {
            // no comments found
            if (action.payload.comments === undefined) return;

            commentsAdapter.upsertMany(
                state,
                Object.values(action.payload.comments)
            );
        },
        [fetchById.fulfilled]: (state, action) => {
            // no comments found
            if (action.payload.entities.comments === undefined) return;
            
            var comments = Object.values(action.payload.entities.comments);
            commentsAdapter.upsertMany(state, comments);
        },
        [commentVoted.fulfilled]: (state, action) => {
            const {commentID, voteState } = action.payload
            console.log(action.payload);
            var scoreDiff = voteState - state.entities[commentID].upvoted
            state.entities[commentID].upvoted = voteState
            state.entities[commentID].score += scoreDiff
        },
        [commentCreated.fulfilled]: (state, action) => {
            const {result, entities} = action.payload;

            if (entities === undefined || entities.comments === undefined) 
                return;
                
            commentsAdapter.upsertMany(state, entities.comments);
            state.createdCommentID = result;
        }
    },
});

export const commentsReducer = commentSlice.reducer;
export const selectors = commentsAdapter.getSelectors(
    (state) => state.comments
);

const selectPropsPostId = (state, postId) => postId;
export const selectCommentsByPostId = createSelector(
    [selectors.selectEntities, selectPropsPostId],
    (commentEntities, postId) => {
        const commentArray = Object.values(commentEntities);

        return commentArray.filter((comment) => comment.post_id === postId);
    }
);
