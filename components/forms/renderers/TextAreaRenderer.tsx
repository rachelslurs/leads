'use client';
import React from 'react';
import { rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { useFormContext } from '../FormContext';
import { BaseRendererProps, UISchemaElementWithScope, JsonSchemaWithCustom } from './types';
import { getErrorState, createAccessibleLabel } from './errorUtils';
import { ERROR_MESSAGES } from '@/lib/constants/formText';

interface TextAreaRendererProps extends BaseRendererProps {
  data: string;
}

const TextAreaRenderer = React.memo(({
  data,
  handleChange,
  path,
  errors,
  schema,
  uischema,
}: TextAreaRendererProps) => {
  const context = useFormContext();
  const isRequired = schema.required?.includes(path.split('.').pop() || '') || false;
  const placeholder = uischema?.options?.placeholder || schema.title || '';
  
  // Use shared error handling
  const fieldName = path.split('.').pop() || '';
  const errorState = getErrorState(fieldName, data, errors, context);
  
  // Create accessible label
  const accessibleLabel = createAccessibleLabel(schema.title || '', isRequired);

  return (
    <div className="mb-4">
      <textarea
        value={data || ''}
        onChange={(e) => handleChange(path, e.target.value)}
        placeholder={placeholder}
        rows={6}
        aria-label={accessibleLabel}
        aria-required={isRequired}
        aria-invalid={errorState.hasError ? 'true' : 'false'}
        className={`w-full px-4 py-3 border rounded-lg focus:border-transparent transition-colors resize-vertical text-alma-gray placeholder-gray-400 ${
          errorState.hasError ? 'border-alma-error' : 'border-gray-300'
        }`}
      />
      {errorState.hasError && (
        <p className="mt-1 text-sm text-alma-error">
          {errorState.errorMessage || ERROR_MESSAGES.requiredField(schema.title || 'This field')}
        </p>
      )}
    </div>
  );
});

export const textAreaControlTester = rankWith(
  2,
  (uischema, schema): boolean => {
    const uiSchemaWithScope = uischema as UISchemaElementWithScope;
    if (uiSchemaWithScope?.scope) {
      const path = uiSchemaWithScope.scope.replace('#/properties/', '');
      const fieldSchema = (schema as JsonSchemaWithCustom)?.properties?.[path];
      return fieldSchema?.type === 'string' && 
             uiSchemaWithScope?.options?.multi === true;
    }
    return false;
  }
);

export default withJsonFormsControlProps(TextAreaRenderer);