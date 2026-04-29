import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const imageGenApi = createApi({
    reducerPath: 'imageGenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token)
                headers.set('Authorization', `Bearer ${token}`);
            return headers;
        }
    }),
    endpoints: (build) => ({
        textToImage: build.mutation<any, { prompt: string }>({
            query: (prompt) => ({
                url: '/text-to-image/generate-image',
                method: 'POST',
                body: prompt
            })
        })
    })
});

export const { useTextToImageMutation } = imageGenApi;