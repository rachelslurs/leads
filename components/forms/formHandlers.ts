// Form change handler utilities
import { FormChangeEvent } from './renderers/types';

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
            errorMap[field] = errorObj.message || 'Invalid value';
          }
        }
      });
    }

    // Clear errors for fields that are no longer invalid
    setErrors((prev: Record<string, string>) => {
      const newErrors = { ...prev };
      // Remove errors for fields that are no longer in the error list
      // Also remove errors for fields that have been fixed (have valid content)
      Object.keys(newErrors).forEach(field => {
        if (!errorMap[field] && newData[field] !== undefined && newData[field] !== '') {
          // Check if the field is now valid (not empty and no validation errors)
          const fieldValue = newData[field];
          const isValid = fieldValue !== null && fieldValue !== undefined &&
            (typeof fieldValue === 'string' ? fieldValue.trim() !== '' : true) &&
            (Array.isArray(fieldValue) ? fieldValue.length > 0 : true);

          if (isValid) {
            delete newErrors[field];
          }
        }
      });
      // Add new errors
      return { ...newErrors, ...errorMap };
    });
  };
}
