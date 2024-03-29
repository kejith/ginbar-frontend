import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { postReducer } from "./slices/postSlice";
import { votesReducer } from "./slices/voteSlice";
import { commentsReducer } from "./slices/commentSlice";
import { tagsReducer } from "./slices/tagsSlice";
import { usersReducer } from "./slices/usersSlice";
import { appReducer } from "./slices/appSlice";

var storeConfig = {
    reducer: {
        posts: postReducer,
        comments: commentsReducer,
        votes: votesReducer,
        tags: tagsReducer,
        users: usersReducer,
        app: appReducer,
    },
    middleware: [...getDefaultMiddleware()],
    devTools: process.env.NODE_ENV !== "production",
};

const store = configureStore(storeConfig);

export default store;
