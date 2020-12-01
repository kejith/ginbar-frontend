var urlPostApi = "/api/post/";
var urlCommentApi = "/api/comment/";
var urlVoteApi = "/api/vote/";
var urlTagApi = "/api/tag/";

const fetchAll = () => {
    try {
        var promise = fetch(urlPostApi)
            .then((response) => response.json())
            .then((data) => {
                return data;
            });

        return promise;
    } catch (err) {
        throw err;
    }
};

const fetchById = (postID) => {
    try {
        var promise = fetch(urlPostApi + postID)
            .then((response) => response.json())
            .then((response) => {
                return response.data;
            });
        return promise;
    } catch (err) {
        throw err;
    }
};

const upsertVote = (vote) => {
    const requestOptions = {
        method: "POST",
        body: vote.formData,
    };

    try {
        var promise = fetch(
            urlVoteApi + (vote.isUpdate ? "update" : "create"),
            requestOptions
        )
            .then((response) => response.json())
            .then((response) => {
                return response.data;
            });

        return promise;
    } catch (err) {
        throw err;
    }
};

const voteComment = (data) => {
    let formData = new FormData();
    formData.append("comment_id", data.commentID);
    formData.append("vote_state", data.voteState);

    const requestOptions = { method: "POST", body: formData };

    try {
        var promise = fetch(urlCommentApi + "vote", requestOptions);
        return promise;
    } catch (err) {
        throw err;
    }
};

const votePost = (data) => {
    let formData = new FormData();
    formData.append("post_id", data.postID);
    formData.append("vote_state", data.voteState);

    const requestOptions = { method: "POST", body: formData };

    try {
        var promise = fetch(urlPostApi + "vote", requestOptions);
        return promise;
    } catch (err) {
        throw err;
    }
};

const votePostTag = (data) => {
    let formData = new FormData();
    formData.append("post_tag_id", data.postTagID);
    formData.append("vote_state", data.voteState);

    const requestOptions = { method: "POST", body: formData };

    try {
        var promise = fetch(urlTagApi + "vote", requestOptions);
        return promise;
    } catch (err) {
        throw err;
    }
};

const createTag = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("post_id", data.postID);

    const requestOptions = {
        method: "POST",
        body: formData,
    };

    try {
        var promise = fetch(
            urlTagApi + "create",
            requestOptions
        ).then((response) => response.json());
        return promise;
    } catch (err) {
        throw err;
    }
};

const createComment = (data) => {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("post_id", data.postID);

    const requestOptions = {
        method: "POST",
        body: formData,
    };

    try {
        var promise = fetch(
            urlCommentApi + "create",
            requestOptions
        ).then((response) => response.json());
        return promise;
    } catch (err) {
        throw err;
    }
};

const postAPI = {
    fetchAll,
    fetchById,
    votePost,
};

export const voteAPI = {
    upsertVote,
};

export const commentAPI = {
    voteComment,
    createComment,
};

export const tagAPI = {
    votePostTag,
    createTag,
};

export default postAPI;
