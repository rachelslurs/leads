'use client';
import React from 'react';
import { rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ChevronDown } from 'lucide-react';
import { useFormContext } from '../FormContext';
import { BaseRendererProps, UISchemaElementWithScope, JsonSchemaWithCustom, hasEnumProperty } from './types';
import { getErrorState, createAccessibleLabel } from './errorUtils';

interface SelectRendererProps extends BaseRendererProps {
  data: string;
}

const SelectRenderer = React.memo(({
  data,
  handleChange,
  path,
  errors,
  schema,
}: SelectRendererProps) => {
  const context = useFormContext();
  const isRequired = schema.required?.includes(path.split('.').pop() || '') || false;
  const options = schema.enum || [];
  const placeholder = `Select ${schema.title}`;
  
  // Use shared error handling
  const fieldName = path.split('.').pop() || '';
  const errorState = getErrorState(fieldName, data, errors, context);
  
  // Create accessible label
  const accessibleLabel = createAccessibleLabel(schema.title || '', isRequired);

  return (
    <div className="mb-4">
      <div className="relative">
        <select
          value={data || ''}
          onChange={(e) => handleChange(path, e.target.value)}
          aria-label={accessibleLabel}
          aria-required={isRequired}
          aria-invalid={errorState.hasError ? 'true' : 'false'}
          className={`w-full px-4 py-3 border border-solid rounded-md focus:border-transparent transition-colors appearance-none bg-white ${
            errorState.hasError ? 'border-alma-error' : 'border-gray-300'
          } ${!data ? 'text-gray-400' : 'text-alma-gray'}`}
          style={{
            borderColor: errorState.hasError ? undefined : '#d1d5db' // fallback for border-gray-300
          }}
        >
          <option value="" disabled style={{ color: '#9ca3af' }}>{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option} className="text-alma-gray">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {errorState.hasError && (
        <p className="mt-1 text-sm text-alma-error">
          {errorState.errorMessage || `${schema.title} is required`}
        </p>
      )}
    </div>
  );
});

export const selectControlTester = rankWith(
  3,
  (uischema, schema): boolean => {
    const uiSchemaWithScope = uischema as UISchemaElementWithScope;
    if (uiSchemaWithScope?.scope) {
      const path = uiSchemaWithScope.scope.replace('#/properties/', '');
      const fieldSchema = (schema as JsonSchemaWithCustom)?.properties?.[path];
      return fieldSchema?.type === 'string' && 
             hasEnumProperty(fieldSchema);
    }
    return false;
  }
);

export default withJsonFormsControlProps(SelectRenderer);