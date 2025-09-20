// Type guard utilities for error handling

export interface ErrorWithData {
  data: {
    errors?: Record<string, string>;
    error?: string;
  };
}

export interface ErrorWithMessage {
  message: string;
}

/**
 * Type guard to check if an error has a data property with errors or error message
 */
export function isErrorWithData(err: unknown): err is ErrorWithData {
  return typeof err === 'object' && err !== null && 'data' in err;
}

/**
 * Type guard to check if an error has a message property
 */
export function isErrorWithMessage(err: unknown): err is ErrorWithMessage {
  return typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string';
}

/**
 * Type guard to check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard to check if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if a value is a non-empty array
 */
export function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Type guard to check if a value is a File object
 */
export function isFile(value: unknown): value is File {
  return value instanceof File;
}

/**
 * Type guard to check if a value is a FormData object
 */
export function isFormData(value: unknown): value is FormData {
  return value instanceof FormData;
}
