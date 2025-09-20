import React, { createContext, useContext } from 'react';

export interface FormContextType {
  touchedFields: Set<string>;
  submissionError: string | null;
  serverErrors: Record<string, string>;
  onFieldFocus?: (fieldName: string) => void;
}

const FormContext = createContext<FormContextType>({
  touchedFields: new Set(),
  submissionError: null,
  serverErrors: {},
  onFieldFocus: undefined,
});

export const useFormContext = () => useContext(FormContext);

export const FormProvider: React.FC<{
  children: React.ReactNode;
  touchedFields: Set<string>;
  submissionError: string | null;
  serverErrors: Record<string, string>;
  onFieldFocus?: (fieldName: string) => void;
}> = ({ children, touchedFields, submissionError, serverErrors, onFieldFocus }) => {
  return (
    <FormContext.Provider value={{ touchedFields, submissionError, serverErrors, onFieldFocus }}>
      {children}
    </FormContext.Provider>
  );
};
