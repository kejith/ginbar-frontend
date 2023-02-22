const urlPostApi = "https://ginbar.kejith.de/api/post/";
const urlSearchApi = "https://ginbar.kejith.de/api/post/search/"
const urlCommentApi = "https://ginbar.kejith.de/api/comment/";
const urlVoteApi = "https://ginbar.kejith.de/api/vote/";
const urlTagApi = "https://ginbar.kejith.de/api/tag/";
const urlUserApi = "https://ginbar.kejith.de/api/user/";

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

const searchPosts = (searchString) => {
    try {
        var promise = fetch(urlSearchApi + searchString, {credentials: "include"})
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
        return promise;
    } catch (err) {
        throw err;
    }
}

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

const uploadPost = (data) => {
    const formData = new FormData();
    formData.append("file", data.file);

    let requestOptions = {
        method: "POST",
        body: formData,
        credentials: "include",
    };

    try {
        return fetch(urlPostApi.concat("upload"), requestOptions);
    } catch (err) {
        throw err;
    }
};

const createPostFromUrl = (data) => {
    const formData = new FormData();
    formData.append("URL", data.url);

    let requestOptions = {
        method: "POST",
        body: formData,
        credentials: "include",
    };

    try {
        return fetch(urlPostApi.concat("create"), requestOptions);
    } catch (err) {
        throw err;
    }
};

const deletePost = (data) => {
    const formData = new FormData();
    formData.append("id", data.id);

    let requestOptions = {
        method: "POST",
        body: formData,
        credentials: "include",
    };

    try {
        return fetch(urlPostApi.concat("delete"), requestOptions);
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
        var promise = fetch("https://ginbar.kejith.de/api/check/me", {
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
    createPostFromUrl,
    uploadPost,
    deletePost,
    searchPosts
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
