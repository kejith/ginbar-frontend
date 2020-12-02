import {
    createEntityAdapter,
    createSelector,
    createSlice,
} from "@reduxjs/toolkit";

import {
    fetchAll,
    fetchById,
    commentCreated,
    postVoted,
} from "../actions/actions";

export function objectFlip(obj) {
    return Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = parseInt(key);
        return ret;
    }, {});
}

const postsAdapter = createEntityAdapter({
    selectId: (post) => post.id,
    sortComparer: (a, b) => b.id - a.id,
});

export const postSlice = createSlice({
    name: "posts",
    initialState: postsAdapter.getInitialState({
        fetchState: "idle",
        current: 0,
        next: 0,
        previous: 0,
    }),
    reducers: {
        currentPostChanged: (state, action) => {
            var currentPostId = action.payload;
            state.current = currentPostId;
        },
    },
    extraReducers: {
        [fetchAll.pending]: (state, action) => {
            state.fetchState = "pending";
        },
        [fetchAll.rejected]: (state, action) => {
            state.fetchState = "rejected";
        },
        [fetchAll.fulfilled]: (state, action) => {
            state.fetchState = "fulfilled";

            // no posts found
            if (action.payload.posts === undefined) return;

            postsAdapter.upsertMany(state, action.payload.posts);
        },

        [fetchById.fulfilled]: (state, action) => {
            state.fetchState = "fulfilled";

            // no post found
            if (action.payload.entities.posts === undefined) return;

            var posts = Object.values(action.payload.entities.posts);
            postsAdapter.upsertMany(state, posts);
        },
        [postVoted.fulfilled]: (state, action) => {
            const { postID, voteState } = action.payload;

            if (
                state.entities.length === 0 ||
                state.entities[postID] === undefined
            )
                return;

            var scoreDiff = voteState - state.entities[postID].upvoted;
            state.entities[postID].upvoted = voteState;
            state.entities[postID].score += scoreDiff;
        },
        [commentCreated.fulfilled]: (state, action) => {
            const { result, entities } = action.payload;
            const comments = entities.comments;

            if (result !== 0 && comments[result] !== undefined) {
                const postID = comments[result].post_id;

                if (state.entities[postID].comments !== null) {
                    state.entities[postID].comments.push(result);
                } else {
                    state.entities[postID].comments = [result];
                }
            }
        },
    },
});

export const postReducer = postSlice.reducer;
export const postExtraReducer = postSlice.extraReducers;

export const {
    selectByID: selectPostById,
    selectIds: selectPostIds,
    selectEntities: selectPostEntities,
    selectAll: selectAllPosts,
    selectTotal: selectTotalPosts,
} = postsAdapter.getSelectors((state) => state.posts);

export const selectors = postsAdapter.getSelectors((state) => state.posts);

const selectPropsPostIds = (state, props) => props.postIds;
export const selectPostsByIds = createSelector(
    [selectPostEntities, selectPropsPostIds],
    (entities, postIds) => {
        var result = [];
        for (var i = 0; i < postIds.length; i++) {
            result.push(entities[postIds[i]]);
        }

        return result;
    }
);
