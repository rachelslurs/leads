'use client';
import React from 'react';
import { rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { useFormContext } from '../FormContext';
import { BaseRendererProps, UISchemaElementWithScope, JsonSchemaWithCustom, hasFileUploadProperty, hasEnumProperty } from './types';
import { getErrorState, createAccessibleLabel } from './errorUtils';
import { validateUrl as validateUrlUtil } from '@/lib/validation/validators';

interface TextInputRendererProps extends BaseRendererProps {
  data: string;
}

const TextInputRenderer = React.memo(function TextInputRenderer({
  data,
  handleChange,
  path,
  errors,
  schema,
  uischema,
}: TextInputRendererProps) {
  const context = useFormContext();
  const isRequired = schema.required?.includes(path.split('.').pop() || '') || false;
  const placeholder = uischema?.options?.placeholder || schema.title || '';
  const inputType = schema.format === 'email' ? 'email' : 'text';
  
  // Custom validation for URL format
  const [customError, setCustomError] = React.useState<string>('');
  
  const validateUrl = (url: string) => {
    if (schema.format === 'uri' && url && url.trim() !== '') {
      // Use centralized validation
      const result = validateUrlUtil(url);
      if (!result.isValid) {
        setCustomError(result.errorMessage || 'Invalid URL');
        return false;
      } else {
        setCustomError('');
        return true;
      }
    }
    setCustomError('');
    return true;
  };
  
  // Use shared error handling
  const fieldName = path.split('.').pop() || '';
  const errorState = getErrorState(fieldName, data, errors, context, customError);
  
  // For email fields, always show errors when there are validation errors
  const shouldShowError = errorState.shouldShowError || (schema.format === 'email' && data && data.length > 0);
  const hasError = schema.format === 'email' ? 
    (!!context.serverErrors[fieldName] || (errors.length > 0 && shouldShowError) || (customError !== '' && shouldShowError)) : 
    errorState.hasError;
  
  // Create accessible label
  const accessibleLabel = createAccessibleLabel(schema.title || '', isRequired);

  return (
    <div className="mb-4">
      <input
        type={inputType}
        value={data || ''}
        onChange={(e) => {
          handleChange(path, e.target.value);
          validateUrl(e.target.value);
        }}
        onBlur={(e) => validateUrl(e.target.value)}
        onFocus={(e) => {
          validateUrl(e.target.value);
          const fieldName = path.split('.').pop() || '';
          context.onFieldFocus?.(fieldName);
        }}
        onInput={(e) => {
          // Handle autocomplete and other input events
          handleChange(path, e.currentTarget.value);
          validateUrl(e.currentTarget.value);
        }}
        placeholder={placeholder}
        aria-label={accessibleLabel}
        aria-required={isRequired}
        aria-invalid={hasError ? 'true' : 'false'}
        className={`w-full px-4 py-3 border border-solid rounded-md focus:outline-none focus:border-alma-gray transition-colors text-alma-gray placeholder-gray-400 bg-white ${
          hasError ? 'border-alma-error' : 'border-gray-300'
        }`}
        style={{
          borderColor: hasError ? undefined : '#d1d5db' // fallback for border-gray-300
        }}
      />
      {hasError && (
        <p className="mt-1 text-sm text-alma-error">
          {errorState.errorMessage || 
           (schema.format === 'uri' ? 'Please enter a valid URL' : 
            schema.format === 'email' ? 'Please enter a valid email address' :
            `${schema.title} is required`)}
        </p>
      )}
    </div>
  );
});

export const textInputControlTester = rankWith(
  1,
  (uischema, schema): boolean => {
    const uiSchemaWithScope = uischema as UISchemaElementWithScope;
    if (uiSchemaWithScope?.scope) {
      const path = uiSchemaWithScope.scope.replace('#/properties/', '');
      const fieldSchema = (schema as JsonSchemaWithCustom)?.properties?.[path];
      return fieldSchema?.type === 'string' && 
             !hasEnumProperty(fieldSchema) && 
             !uiSchemaWithScope?.options?.multi &&
             !hasFileUploadProperty(fieldSchema);
    }
    return false;
  }
);
export default withJsonFormsControlProps(TextInputRenderer);