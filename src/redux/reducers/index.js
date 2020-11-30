import * as actions from "../actions/types";

const initialState = {
    posts: [],
    rerender: false,
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.POSTS_ADDED:
            return {
                posts: action.payload.posts,
            };
        case actions.COMMENT_VOTED:
            var vote = action.payload.vote;
            var postID = action.payload.postID;

            var posts = JSON.parse(JSON.stringify(state.posts));
            const isPost = (post) => post.id === postID;
            const isComment = (comment) => comment.id === vote.comment_id;

            var idxPost = posts.findIndex(isPost);
            var idxComment = posts[idxPost].Comments.findIndex(isComment);

            if (idxPost >= 0 && idxComment >= 0) {
                posts[idxPost].Comments[idxComment].vote = vote;
            }

            return {
                posts,
                rerender: true,
            };
        case actions.POST_VOTED:
            break;
        default:
            return state;
    }
}

export default reducer;
