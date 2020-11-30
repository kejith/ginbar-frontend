var postApi = "/api/post/";
var voteApi = "/api/vote/";

const fetchAll = () => {
    try {
        var promise = fetch(postApi)
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
        var promise = fetch(postApi + postID)
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
            voteApi + (vote.isUpdate ? "update" : "create"),
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
        var promise = fetch("/api/comment/vote", requestOptions);
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
            "/api/comment/create",
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
};

export const voteAPI = {
    upsertVote,
};

export const commentAPI = {
    voteComment,
    createComment,
};

export default postAPI;
