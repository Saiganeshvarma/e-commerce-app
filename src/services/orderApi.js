import { ecommerceApi } from './ecommerceApi';

export const orderApi = ecommerceApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/orders',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Order', 'Cart'],
        }),
        getOrderDetails: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        getMyOrders: builder.query({
            query: () => '/orders/my-orders',
            providesTags: ['Order'],
        }),
        getAllOrders: builder.query({
            query: () => '/orders',
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => ['Order', { type: 'Order', id }],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetMyOrdersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
} = orderApi;
