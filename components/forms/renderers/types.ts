import { ControlProps, UISchemaElement, JsonSchema, JsonSchema4, JsonSchema7 } from '@jsonforms/core';

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

// Helper function to get error message
export function getErrorMessage(error: FormError | undefined): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (isValidationError(error)) return error.message;
  return String(error);
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
