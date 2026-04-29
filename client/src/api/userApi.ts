import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const userApi = createApi({
    reducerPath: 'userApi',
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
        register: build.mutation<any, { username: string; email: string; password: string }>({
            query: (userData) => ({
                url: '/user/register',
                method: 'POST',
                body: userData,
            }),
        }),
        login: build.mutation<any, { email: string; password: string }>({
            query: (userData) => ({
                url: '/user/login',
                method: 'POST',
                body: userData,
            }),
        }),
        unknowncredit: build.query<any, void>({
            query: () => ({
                url: '/user/unknown-credit',
                method: 'GET'
            })
        })
    })
});

export const { useRegisterMutation, useLoginMutation, useUnknowncreditQuery } = userApi;