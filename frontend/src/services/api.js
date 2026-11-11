import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Reading', 'Report'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (details) => ({ url: '/auth/register', method: 'POST', body: details })
    }),
    login: builder.mutation({
      query: (details) => ({ url: '/auth/login', method: 'POST', body: details })
    }),
    getReadings: builder.query({
      query: (date) => `/readings?date=${date}`,
      providesTags: (result = { readings: [] }) => [
        { type: 'Reading', id: 'LIST' },
        ...result.readings.map(({ _id }) => ({ type: 'Reading', id: _id }))
      ]
    }),
    createReading: builder.mutation({
      query: (reading) => ({ url: '/readings', method: 'POST', body: reading }),
      invalidatesTags: ['Reading', 'Report']
    }),
    updateReading: builder.mutation({
      query: ({ id, ...reading }) => ({ url: `/readings/${id}`, method: 'PUT', body: reading }),
      invalidatesTags: ['Reading', 'Report']
    }),
    deleteReading: builder.mutation({
      query: (id) => ({ url: `/readings/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Reading', 'Report']
    }),
    getReports: builder.query({
      query: (date) => `/reports?date=${date}`,
      providesTags: ['Report']
    })
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetReadingsQuery,
  useCreateReadingMutation,
  useUpdateReadingMutation,
  useDeleteReadingMutation,
  useGetReportsQuery
} = api;
