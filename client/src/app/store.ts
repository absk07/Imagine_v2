import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import historyReducer from '../features/user/historySlice';
import { userApi } from '../api/userApi';
import { imageGenApi } from '../api/imageApi';
import { historyApi } from '../api/historyApi';

export const store = configureStore({
    reducer: {
        user: userReducer,
        history: historyReducer,
        [userApi.reducerPath]: userApi.reducer,
        [imageGenApi.reducerPath]: imageGenApi.reducer,
        [historyApi.reducerPath]: historyApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(userApi.middleware)
    .concat(imageGenApi.middleware)
    .concat(historyApi.middleware),
    devTools: import.meta.env.VITE_ENV !== 'production'
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;