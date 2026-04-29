import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const historyApi = createApi({
    reducerPath: 'historyApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (build) => ({
        getAllHistory: build.query<any, void>({
            query: () => ({
                url: '/history',
                method: 'GET',
            }),
        }),
        getHistoryById: build.query<any, string>({
            query: (id) => ({
                url: `/history/${id}`,
                method: 'GET',
            }),
        }),
        // createHistory: build.mutation<any, { historyName: string; imgUrl: string }>({
        //     query: (historyData) => ({
        //         url: `/history/create`,
        //         method: 'POST',
        //         body: historyData,
        //     }),
        // }),
        editHistory: build.mutation<any, { id: string; historyName: string }>({
            query: ({ id, historyName }) => ({
                url: `/history/${id}`,
                method: 'PUT',
                body: { historyName },
            }),
        }),
        deleteHistory: build.mutation<any, string>({
            query: (id) => ({
                url: `/history/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllHistoryQuery,
    useGetHistoryByIdQuery,
    useEditHistoryMutation,
    useDeleteHistoryMutation,
} = historyApi;