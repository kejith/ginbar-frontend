import { schema } from "normalizr";
import { normalize } from "normalizr";
import postAPI, { commentAPI, tagAPI, userAPI } from "../slices/postsAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";

const commentEntity = new schema.Entity("comments");
const userEntity = new schema.Entity("users");
const tagEntity = new schema.Entity("tags");

const postEntity = new schema.Entity("posts", {
    comments: [commentEntity],
    tags: [tagEntity],
});

export const fetchAll = createAsyncThunk(
    "posts/fetchAll",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = postAPI.fetchAll(payload);

            const data = await promise;
            const normalized = normalize(data, { posts: [postEntity] });

            return normalized.entities;
        } catch (err) {
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const fetchById = createAsyncThunk(
    "posts/fetchById",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = postAPI.fetchById(payload);
            const data = await promise;
            const normalized = normalize(data, postEntity);
            return normalized;
        } catch (err) {
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const postVoted = createAsyncThunk(
    "posts/upsertVote",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = postAPI.votePost(payload);
            await promise;
            return payload;
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const commentVoted = createAsyncThunk(
    "comments/upsertVote",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = commentAPI.voteComment(payload);
            await promise;
            return payload;
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const postTagVoted = createAsyncThunk(
    "postTags/upsertVote",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = tagAPI.votePostTag(payload);
            await promise;
            return payload;
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const commentCreated = createAsyncThunk(
    "comments/create",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = commentAPI.createComment(payload);
            const data = await promise;

            const normalized = normalize(data, commentEntity);

            return normalized;
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const postCreated = createAsyncThunk(
    "posts/create",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            var promise;
            switch (payload.type) {
                case "upload":
                    promise = postAPI.uploadPost(payload);
                    break;
                case "url":
                    promise = postAPI.createPostFromUrl(payload);
                    break;

                default:
                    break;
            }

            const response = await promise;
            const data = await response.json();

            if (
                data.status !== undefined &&
                data.status === "possibleDuplicatesFound"
            ) {
                if (data.posts !== undefined) {
                    const normalized = normalize(data.posts, [postEntity]);
                    return {
                        data: normalized,
                        status: "possibleDuplicatesFound",
                    };
                }
            }

            const normalized = normalize(data, postEntity);

            dispatch(fetchAll({}));

            return normalized;
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const postTagCreated = createAsyncThunk(
    "tags/create",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = tagAPI.createTag(payload);
            const data = await promise;

            const normalized = normalize(data, tagEntity);

            return normalized;
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const userLoggedIn = createAsyncThunk(
    "user/login",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = userAPI.login(payload);
            const data = await promise;

            const normalized = normalize(data, userEntity);

            return normalized;
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const userChecked = createAsyncThunk(
    "user/check",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = userAPI.checkMe(payload);
            const response = await promise;

            if (response.ok) {
                var data = await response.json();
                const normalized = normalize(data, userEntity);
                return normalized;
            } else {
                return rejectWithValue(response.status);
            }
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);

export const userLoggedOut = createAsyncThunk(
    "user/logout",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = userAPI.logout();
            const response = await promise;

            if (response.ok) {
                return;
            } else {
                return rejectWithValue(response.status);
            }
        } catch (err) {
            console.log(err);
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);
