import { configureStore } from '@reduxjs/toolkit';
import { leadsApi } from './leadsApi';
import authSlice from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [leadsApi.reducerPath]: leadsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(leadsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;