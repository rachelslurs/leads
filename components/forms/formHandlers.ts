// Form change handler utilities
import { FormChangeEvent, getErrorMessage, FormError } from './renderers/types';
import { ERROR_MESSAGES } from '@/lib/constants/formText';

export interface FormChangeHandlerConfig {
  data: Record<string, unknown>;
  errors: unknown[];
  setData: (data: Record<string, unknown>) => void;
  setErrors: (errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  setSubmissionError: (error: string | null) => void;
  setTouchedFields: (fields: Set<string>) => void;
  touchedFields: Set<string>;
  clearFieldError: (field: string) => void;
}

export function createFormChangeHandler({
  setData,
  setErrors,
  setSubmissionError,
  setTouchedFields,
  touchedFields,
  clearFieldError,
}: FormChangeHandlerConfig) {
  return ({ data: newData, errors: newErrors }: FormChangeEvent) => {
    setData(newData as Record<string, unknown>);

    // Clear submission errors when user starts making changes
    setSubmissionError(null);

    // Track touched fields and clear errors for fields being actively edited
    const newTouchedFields = new Set(touchedFields);
    Object.keys(newData).forEach(key => {
      if (newData[key] !== undefined && newData[key] !== '') {
        newTouchedFields.add(key);
        // Clear any existing errors for this field when user starts typing
        clearFieldError(key);
      }
    });
    setTouchedFields(newTouchedFields);

    // Convert JSON Forms errors to a simpler format and replace existing errors
    const errorMap: Record<string, string> = {};
    if (Array.isArray(newErrors)) {
      newErrors.forEach(error => {
        if (error && typeof error === 'object' && 'instancePath' in error) {
          const errorObj = error as { instancePath?: string; message?: string };
          if (errorObj.instancePath) {
            const field = errorObj.instancePath.replace('#/', '').replace(/\//g, '.');
            errorMap[field] = getErrorMessage(errorObj as FormError) || ERROR_MESSAGES.invalidValue;
          }
        }
      });
    }

    // Update errors - replace existing errors with new ones
    setErrors((prev: Record<string, string>) => {
      // Start with new errors from JsonForms validation
      const newErrors = { ...errorMap };
      
      // For fields that don't have new errors, check if they should keep their existing errors
      Object.keys(prev).forEach(field => {
        if (!errorMap[field] && prev[field]) {
          const fieldValue = newData[field];
          const hasValidContent = fieldValue !== null && fieldValue !== undefined &&
            (typeof fieldValue === 'string' ? fieldValue.trim() !== '' : true) &&
            (Array.isArray(fieldValue) ? fieldValue.length > 0 : true);
          
          // Keep the error only if the field doesn't have valid content
          if (!hasValidContent) {
            newErrors[field] = prev[field];
          }
        }
      });
      
      return newErrors;
    });
  };
}
