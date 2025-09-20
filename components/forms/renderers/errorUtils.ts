import { FormContextType } from '../FormContext';
import { FormError, getErrorMessage } from './types';
import { ACCESSIBILITY_LABELS } from '@/lib/constants/formText';

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
    // Process each error and get the first valid error message
    for (const error of errors) {
      const processedMessage = getErrorMessage(error as FormError);
      if (processedMessage) {
        errorMessage = processedMessage;
        break;
      }
    }
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
  return ACCESSIBILITY_LABELS.createLabel(title, isRequired);
}
