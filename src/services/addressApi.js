import { ecommerceApi } from './ecommerceApi';

export const addressApi = ecommerceApi.injectEndpoints({
    endpoints: (builder) => ({
        getAddresses: builder.query({
            query: () => '/address',
            providesTags: ['Address'],
        }),
        addAddress: builder.mutation({
            query: (data) => ({
                url: '/address',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Address'],
        }),
        updateAddress: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/address/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Address'],
        }),
        deleteAddress: builder.mutation({
            query: (id) => ({
                url: `/address/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Address'],
        }),
    }),
});

export const {
    useGetAddressesQuery,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
} = addressApi;
