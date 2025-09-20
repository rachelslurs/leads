import { FormContextType } from '../FormContext';
import { FormError, getErrorMessage } from './types';

export interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  shouldShowError: boolean;
}

export function getErrorState(
  fieldName: string,
  data: string | string[] | unknown,
  errors: unknown,
  context: FormContextType,
  customError?: string
): ErrorState {
  const { touchedFields, submissionError, serverErrors } = context;
  
  const hasBeenTouched = touchedFields?.has(fieldName) || false;
  const hasContent = data && (typeof data === 'string' ? data.length > 0 : Array.isArray(data) ? data.length > 0 : true);
  const hasSubmissionError = submissionError !== null;
  const shouldShowError = hasBeenTouched || hasContent || hasSubmissionError;
  
  const serverError = serverErrors[fieldName];
  const hasError = (Array.isArray(errors) ? errors.length > 0 : !!errors) || !!serverError || !!customError;
  
  let errorMessage = '';
  if (serverError) {
    errorMessage = serverError;
  } else if (customError) {
    errorMessage = customError;
  } else if (Array.isArray(errors) && errors.length > 0) {
    errorMessage = getErrorMessage(errors[0] as FormError);
  } else if (errors) {
    errorMessage = getErrorMessage(errors as FormError);
  }
  
  return {
    hasError: hasError && !!shouldShowError,
    errorMessage,
    shouldShowError: !!shouldShowError
  };
}

export function createAccessibleLabel(title: string, isRequired: boolean): string {
  return `${title}${isRequired ? ' (required)' : ''}`;
}
