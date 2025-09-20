import { ControlProps, UISchemaElement, JsonSchema, JsonSchema4, JsonSchema7 } from '@jsonforms/core';
import { ERROR_MESSAGES } from '@/lib/constants/formText';

// Form data value types
export type FormDataValue = string | string[] | number | boolean | null | undefined;

// Error types for form validation
export interface ValidationError {
  message: string;
  instancePath?: string;
  schemaPath?: string;
  keyword?: string;
  params?: Record<string, unknown>;
}

export type FormError = string | ValidationError;

// Type guard for ValidationError
export function isValidationError(error: unknown): error is ValidationError {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
}

// Helper function to get user-friendly error message
export function getErrorMessage(error: FormError | undefined): string {
  if (!error) return '';
  if (typeof error === 'string') {
    // Handle string errors that might contain JSON schema validation messages
    if (error.includes('must match format "email"')) {
      return ERROR_MESSAGES.invalidEmail;
    }
    if (error.includes('must match format "uri"')) {
      return ERROR_MESSAGES.invalidUrl;
    }
    if (error.includes('must not have fewer than 1 character') || 
        error.includes('must NOT have fewer than 1 character') ||
        error.includes('must not have fewer than 1 characters') ||
        error.includes('must NOT have fewer than 1 characters') ||
        error.includes('must not be shorter than 1 character') ||
        error.includes('must NOT be shorter than 1 character') ||
        error.includes('must not be shorter than 1 characters') ||
        error.includes('must NOT be shorter than 1 characters')) {
      return ERROR_MESSAGES.required;
    }
    if (error.includes('must not have fewer than 1 items') ||
        error.includes('must NOT have fewer than 1 items') ||
        error.includes('must not have fewer than 1 item') ||
        error.includes('must NOT have fewer than 1 item')) {
      return ERROR_MESSAGES.selectAtLeastOne;
    }
    if (error.includes('must be equal to one of the allowed values') ||
        error.includes('must be equal to one of the allowed value')) {
      return ERROR_MESSAGES.invalidSelection;
    }
    if (error.includes('must be array')) {
      return ERROR_MESSAGES.selectAtLeastOne;
    }
    if (error.includes('is a required property') ||
        error.includes('is required') ||
        error.includes('must be present') ||
        error.includes('must NOT be empty') ||
        error.includes('must not be empty') ||
        error.includes('must NOT be null') ||
        error.includes('must not be null')) {
      return ERROR_MESSAGES.required;
    }
    return error;
  }
  if (isValidationError(error)) {
    // Convert JSON schema validation errors to user-friendly messages
    const message = error.message;
    
    // Handle common JSON schema validation messages
    if (message.includes('must match format "email"')) {
      return ERROR_MESSAGES.invalidEmail;
    }
    if (message.includes('must match format "uri"')) {
      return ERROR_MESSAGES.invalidUrl;
    }
    if (message.includes('must not have fewer than 1 character') || 
        message.includes('must NOT have fewer than 1 character') ||
        message.includes('must not have fewer than 1 characters') ||
        message.includes('must NOT have fewer than 1 characters') ||
        message.includes('must not be shorter than 1 character') ||
        message.includes('must NOT be shorter than 1 character') ||
        message.includes('must not be shorter than 1 characters') ||
        message.includes('must NOT be shorter than 1 characters')) {
      return ERROR_MESSAGES.required;
    }
    if (message.includes('must not have fewer than 1 items') ||
        message.includes('must NOT have fewer than 1 items') ||
        message.includes('must not have fewer than 1 item') ||
        message.includes('must NOT have fewer than 1 item')) {
      return ERROR_MESSAGES.selectAtLeastOne;
    }
    if (message.includes('must be equal to one of the allowed values') ||
        message.includes('must be equal to one of the allowed value')) {
      return ERROR_MESSAGES.invalidSelection;
    }
    if (message.includes('must be array')) {
      return ERROR_MESSAGES.selectAtLeastOne;
    }
    if (message.includes('is a required property') ||
        message.includes('is required') ||
        message.includes('must be present') ||
        message.includes('must NOT be empty') ||
        message.includes('must not be empty') ||
        message.includes('must NOT be null') ||
        message.includes('must not be null')) {
      return ERROR_MESSAGES.required;
    }
    
    return message;
  }
  
  // Handle other error types (objects, etc.)
  const errorString = String(error);
  if (errorString.includes('must match format "email"')) {
    return ERROR_MESSAGES.invalidEmail;
  }
  if (errorString.includes('must match format "uri"')) {
    return ERROR_MESSAGES.invalidUrl;
  }
  if (errorString.includes('must not have fewer than 1 character') || 
      errorString.includes('must NOT have fewer than 1 character') ||
      errorString.includes('must not have fewer than 1 characters') ||
      errorString.includes('must NOT have fewer than 1 characters') ||
      errorString.includes('must not be shorter than 1 character') ||
      errorString.includes('must NOT be shorter than 1 character') ||
      errorString.includes('must not be shorter than 1 characters') ||
      errorString.includes('must NOT be shorter than 1 characters')) {
    return ERROR_MESSAGES.required;
  }
  if (errorString.includes('must not have fewer than 1 items') ||
      errorString.includes('must NOT have fewer than 1 items') ||
      errorString.includes('must not have fewer than 1 item') ||
      errorString.includes('must NOT have fewer than 1 item')) {
    return ERROR_MESSAGES.selectAtLeastOne;
  }
  if (errorString.includes('must be equal to one of the allowed values') ||
      errorString.includes('must be equal to one of the allowed value')) {
    return ERROR_MESSAGES.invalidSelection;
  }
  if (errorString.includes('must be array')) {
    return ERROR_MESSAGES.selectAtLeastOne;
  }
  if (errorString.includes('is a required property') ||
      errorString.includes('is required') ||
      errorString.includes('must be present') ||
      errorString.includes('must NOT be empty') ||
      errorString.includes('must not be empty') ||
      errorString.includes('must NOT be null') ||
      errorString.includes('must not be null')) {
    return ERROR_MESSAGES.required;
  }
  
  return errorString;
}

// Extended UISchemaElement with scope property and options
export interface UISchemaElementWithScope {
  type?: string;
  scope?: string;
  options?: {
    placeholder?: string;
    multi?: boolean;
    format?: string;
    accept?: string;
    maxSize?: number;
  };
}

// Extended JsonSchema with custom properties and proper typing
export interface JsonSchemaWithCustom {
  'x-file-upload'?: boolean;
  properties?: Record<string, JsonSchema4 | JsonSchema7>;
  items?: JsonSchema4 | JsonSchema7 | JsonSchemaWithCustom;
  enum?: string[];
  required?: string[];
  title?: string;
  type?: string;
  format?: string;
  minLength?: number;
  minItems?: number;
}

// Specific schema types for different field types
export interface StringSchemaWithCustom extends JsonSchemaWithCustom {
  type: 'string';
  enum?: string[];
  format?: 'email' | 'uri' | 'date' | 'time' | 'date-time';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface ArraySchemaWithCustom extends JsonSchemaWithCustom {
  type: 'array';
  items?: JsonSchemaWithCustom;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

// Form data interface
export interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  linkedin?: string;
  visaInterests?: string[];
  longFormInput?: string;
  resume?: string;
  [key: string]: unknown; // Index signature for dynamic property access
}

// Form change event interface
export interface FormChangeEvent {
  data: FormData;
  errors?: unknown[];
}

// Form change handler interface
export interface FormChangeHandler {
  (event: FormChangeEvent): void;
}

// JsonForms change event interface (what JsonForms actually provides)
export interface JsonFormsChangeEvent {
  data: unknown;
  errors?: unknown;
}

// Type-safe wrapper for JsonForms change events
export function createJsonFormsChangeHandler(
  handler: FormChangeHandler
): (event: JsonFormsChangeEvent) => void {
  return ({ data, errors }) => {
    handler({
      data: data as FormData,
      errors: errors as unknown[] | undefined,
    });
  };
}

// Common renderer props interface
export interface BaseRendererProps extends ControlProps {
  data: FormDataValue;
  handleChange(path: string, value: FormDataValue): void;
  path: string;
}

// Type guards for schema properties
export function isStringSchema(schema: JsonSchema4 | JsonSchema7): schema is JsonSchema4 | JsonSchema7 {
  return schema.type === 'string';
}

export function isArraySchema(schema: JsonSchema4 | JsonSchema7 | undefined): schema is JsonSchema4 | JsonSchema7 {
  return schema !== undefined && schema.type === 'array';
}

export function hasEnumProperty(schema: JsonSchema4 | JsonSchema7 | JsonSchema4[] | JsonSchema7[] | undefined): schema is (JsonSchema4 | JsonSchema7) & { enum: string[] } {
  return schema !== undefined && !Array.isArray(schema) && 'enum' in schema && Array.isArray(schema.enum);
}

export function hasFileUploadProperty(schema: JsonSchema4 | JsonSchema7): schema is JsonSchema4 | JsonSchema7 & { 'x-file-upload': boolean } {
  return 'x-file-upload' in schema && typeof schema['x-file-upload'] === 'boolean';
}

// Tester function type
export type ControlTester = (uischema: UISchemaElement, schema: JsonSchema) => boolean;
