import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import JsonLeadForm from '@/components/forms/JsonLeadForm';
import { leadsApi } from '@/lib/redux/leadsApi';
import authSlice from '@/lib/redux/authSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      [leadsApi.reducerPath]: leadsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(leadsApi.middleware),
  });
};

describe('JsonLeadForm', () => {
  it('renders form title', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <JsonLeadForm />
      </Provider>
    );

    expect(screen.getAllByText((content, element) => {
      return element?.textContent === 'Get An AssessmentOf Your Immigration Case';
    })[0]).toBeInTheDocument();
  });

  it('displays submit button', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <JsonLeadForm />
      </Provider>
    );

    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});