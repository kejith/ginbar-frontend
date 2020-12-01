import { schema } from "normalizr";
import { normalize } from "normalizr";
import postAPI, { commentAPI, tagAPI } from "../slices/postsAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";

const commentEntity = new schema.Entity("comments");
const tagEntity = new schema.Entity("tags");

const postEntity = new schema.Entity("posts", {
    comments: [commentEntity],
    tags: [tagEntity],
});

export const fetchAll = createAsyncThunk(
    "posts/fetchAll",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const promise = postAPI.fetchAll();

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

/*
export const upsertVoteThunk = createAsyncThunk(
    "posts/upsertVoteThunk",
    async (votePayload, { dispatch, rejectWithValue }) => {
        try {
            const promise = voteAPI.upsertVote(votePayload);
            const data = await promise;
            const normalized = normalize(data, voteEntity);
            return normalized;
        } catch (err) {
            if (!err.response) {
                throw err;
            }

            return rejectWithValue(err.response);
        }
    }
);
*/
