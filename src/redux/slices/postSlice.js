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
    postCreated,
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
        [postCreated.fulfilled]: (state, action) => {
            state.fetchState = "fulfilled";

            // no post found
            if (action.payload.entities.posts === undefined) return;

            var posts = Object.values(action.payload.entities.posts);
            postsAdapter.upsertMany(state, posts);

            if (
                action.payload.result !== undefined &&
                action.payload.result !== 0
            ) {
                state.current = action.payload.result;
            }
        },
        [postVoted.fulfilled]: (state, action) => {
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

export const selectLowestID = createSelector(
    selectPostIds,
    (ids) => ids[ids.length - 1]
);

export const selectHighestID = createSelector(selectPostIds, (ids) => ids[0]);

export const selectCurrentID = createSelector(
    (state) => state.posts,
    (posts) => posts.current
);

export const selectNextID = createSelector(
    selectors.selectIds,
    selectCurrentID,
    (postsIds, currentPostShown) => {
        var currentIndex = postsIds.indexOf(currentPostShown);
        if (currentIndex !== undefined && currentIndex < postsIds.length - 1) {
            var nextPostId = postsIds[currentIndex + 1];
            return nextPostId;
        } else {
            return 0;
        }
    }
);

export const selectPreviousID = createSelector(
    selectors.selectIds,
    selectCurrentID,
    (postsIds, currentPostShown) => {
        var currentIndex = postsIds.indexOf(currentPostShown);
        if (currentIndex !== undefined && currentIndex > 0) {
            var previousPostId = postsIds[currentIndex - 1];
            return previousPostId;
        } else {
            return 0;
        }
    }
);
