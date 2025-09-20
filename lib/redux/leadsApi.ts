import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Lead, LeadsResponse } from '@/lib/types/lead';

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Lead'],
  endpoints: (builder) => ({
    createLead: builder.mutation<
      { success: boolean; leadId: string; message: string },
      FormData
    >({
      query: (formData) => ({
        url: '/leads',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Lead'],
    }),
    getLeads: builder.query<
      LeadsResponse,
      { page?: number; limit?: number; status?: string; search?: string; sortField?: string; sortDirection?: string }
    >({
      query: ({ page = 1, limit = 10, status = 'ALL', search = '', sortField = 'submittedAt', sortDirection = 'desc' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          status,
          search,
          sortField,
          sortDirection,
        });
        return `/leads?${params.toString()}`;
      },
      providesTags: ['Lead'],
    }),
    updateLead: builder.mutation<
      { success: boolean; lead: Lead; message: string },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/leads/${id}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted({ id, formData }, { dispatch, queryFulfilled }) {
        // Optimistic update - we'll update the lead data optimistically
        const patchResult = dispatch(
          leadsApi.util.updateQueryData('getLeads', { page: 1, limit: 10, status: 'ALL', search: '', sortField: 'submittedAt', sortDirection: 'desc' }, (draft) => {
            const lead = draft.leads.find((lead) => lead.id === id);
            if (lead) {
              // Extract data from FormData for optimistic update
              const firstName = formData.get('firstName') as string;
              const lastName = formData.get('lastName') as string;
              const name = formData.get('name') as string;
              const email = formData.get('email') as string;
              const country = formData.get('country') as string;
              const linkedin = formData.get('linkedin') as string;
              const visaInterests = formData.get('visaInterests') as string;
              const longFormInput = formData.get('longFormInput') as string;
              
              if (firstName) lead.firstName = firstName;
              if (lastName) lead.lastName = lastName;
              if (name) lead.name = name;
              if (email) lead.email = email;
              if (country) lead.country = country;
              if (linkedin) lead.linkedin = linkedin;
              if (visaInterests) lead.visaInterests = visaInterests;
              if (longFormInput) lead.longFormInput = longFormInput;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Lead'],
    }),
    updateLeadStatus: builder.mutation<
      { success: boolean; lead: Lead },
      { id: string; status: string; leadData?: Partial<Lead> }
    >({
      query: ({ id, status, leadData = {} }) => {
        const formData = new FormData();
        formData.append('firstName', leadData.firstName || '');
        formData.append('lastName', leadData.lastName || '');
        formData.append('name', leadData.name || '');
        formData.append('email', leadData.email || '');
        formData.append('country', leadData.country || '');
        formData.append('linkedin', leadData.linkedin || '');
        formData.append('visaInterests', leadData.visaInterests || '');
        formData.append('longFormInput', leadData.longFormInput || '');
        formData.append('status', status);
        return {
          url: `/leads/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          leadsApi.util.updateQueryData('getLeads', { page: 1, limit: 10, status: 'ALL', search: '', sortField: 'submittedAt', sortDirection: 'desc' }, (draft) => {
            const lead = draft.leads.find((lead) => lead.id === id);
            if (lead) {
              lead.status = status as 'PENDING' | 'REACHED_OUT';
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Lead'],
    }),
    login: builder.mutation<
      { success: boolean; user: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadMutation,
  useUpdateLeadStatusMutation,
  useLoginMutation,
  useLogoutMutation,
} = leadsApi;