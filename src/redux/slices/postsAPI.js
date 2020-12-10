const urlPostApi = "http://kejith.de:8080/api/post/";
const urlCommentApi = "http://kejith.de:8080/api/comment/";
const urlVoteApi = "http://kejith.de:8080/api/vote/";
const urlTagApi = "http://kejith.de:8080/api/tag/";
const urlUserApi = "http://kejith.de:8080/api/user/";

const fetchAll = (data) => {
    try {
        var parameters = "?";
        for (const prop in data) {
            parameters = parameters.concat(`${prop}=${data[prop]}&`);
        }

        var url = urlPostApi.concat(parameters.slice(0, -1));

        console.log(url);

        var promise = fetch(url, {
            credentials: "include",
        })
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
        var promise = fetch(urlPostApi + postID, { credentials: "include" })
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
        credentials: "include",
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
    formData.append("comment_id", data.contentID);
    formData.append("vote_state", data.voteState);

    const requestOptions = {
        method: "POST",
        body: formData,
        credentials: "include",
    };

    try {
        var promise = fetch(urlCommentApi + "vote", requestOptions);
        return promise;
    } catch (err) {
        throw err;
    }
};

const votePost = (data) => {
    let formData = new FormData();
    formData.append("post_id", data.contentID);
    formData.append("vote_state", data.voteState);

    const requestOptions = {
        method: "POST",
        body: formData,
        credentials: "include",
    };

    try {
        var promise = fetch(urlPostApi + "vote", requestOptions);
        return promise;
    } catch (err) {
        throw err;
    }
};

const votePostTag = (data) => {
    let formData = new FormData();
    formData.append("post_tag_id", data.contentID);
    formData.append("vote_state", data.voteState);

    const requestOptions = {
        method: "POST",
        body: formData,
        credentials: "include",
    };

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
        credentials: "include",
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
        credentials: "include",
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

const login = (data) => {
    const formData = new FormData();
    formData.append("name", data.userName);
    formData.append("password", data.password);

    let requestOptions = {
        method: "POST",
        body: formData,
        credentials: "include",
    };

    try {
        var promise = fetch(
            urlUserApi + "login",
            requestOptions
        ).then((response) => response.json());

        return promise;
    } catch (err) {}
};

const logout = () => {
    let requestOptions = { method: "post", credentials: "include" };

    try {
        var promise = fetch(urlUserApi + "logout", requestOptions);

        return promise;
    } catch (err) {}
};

const checkMe = () => {
    try {
        var promise = fetch("http://kejith.de:8080/api/check/me", {
            credentials: "include",
        });

        return promise;
    } catch (error) {
        console.log(error);
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

export const userAPI = {
    login,
    checkMe,
    logout,
};

export default postAPI;
