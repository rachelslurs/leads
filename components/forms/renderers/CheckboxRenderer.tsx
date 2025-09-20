'use client';
import React from 'react';
import { rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Check } from 'lucide-react';
import { useFormContext } from '../FormContext';
import { BaseRendererProps, UISchemaElementWithScope, JsonSchemaWithCustom, isArraySchema, hasEnumProperty } from './types';
import { getErrorState } from './errorUtils';

interface CheckboxRendererProps extends BaseRendererProps {
  data: string[];
}

const CheckboxRenderer = ({
  data,
  handleChange,
  path,
  errors,
  schema,
}: CheckboxRendererProps) => {
  const context = useFormContext();
  const isRequired = schema.required?.includes(path.split('.').pop() || '') || false;
  const options = isArraySchema(schema) && hasEnumProperty(schema.items) ? schema.items.enum : [];
  const selectedValues = data || [];

  // Use shared error handling
  const fieldName = path.split('.').pop() || '';
  const errorState = getErrorState(fieldName, selectedValues, errors, context);


  const handleCheckboxChange = (option: string, checked: boolean) => {
    let newValues: string[];

    if (checked) {
      newValues = [...selectedValues, option];
    } else {
      newValues = selectedValues.filter(val => val !== option);
    }

    handleChange(path, newValues);
  };

  return (
    <div className="mb-4">
      <div
        role="group"
        aria-labelledby={`${path}-label`}
        aria-required={isRequired}
        aria-invalid={errorState.hasError}
        className="space-y-3"
      >
        {options.map((option: string) => {
          const isSelected = selectedValues.includes(option);
          return (
            <label
              key={option}
              className="flex items-center cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                  className="sr-only"
                  aria-describedby={errorState.hasError ? `${path}-error` : undefined}
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                    ? 'bg-alma-purple-light/50 border-alma-purple'
                    : 'bg-white border-gray-300 group-hover:border-alma-purple'
                  }`}>
                  {isSelected && (
                    <Check className="w-3 h-3 text-alma-purple" />
                  )}
                </div>
              </div>
              <span className={`ml-3 text-sm transition-colors ${isSelected ? 'text-alma-gray font-medium' : 'text-gray-600 group-hover:text-alma-gray'
                }`}>
                {option}
              </span>
            </label>
          );
        })}
      </div>

      {errorState.hasError && (
        <p id={`${path}-error`} className="mt-2 text-sm text-alma-error">
          {errorState.errorMessage || 'Please select at least one visa type'}
        </p>
      )}

      {schema.minItems && selectedValues.length === 0 && (
        <p className="mt-1 text-xs text-gray-500">
          Select at least {schema.minItems} option{schema.minItems > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export const checkboxControlTester = rankWith(
  4,
  (uischema, schema): boolean => {
    const uiSchemaWithScope = uischema as UISchemaElementWithScope;
    if (uiSchemaWithScope?.scope) {
      const path = uiSchemaWithScope.scope.replace('#/properties/', '');
      const fieldSchema = (schema as JsonSchemaWithCustom)?.properties?.[path];
      return fieldSchema?.type === 'array' &&
        isArraySchema(fieldSchema) &&
        hasEnumProperty(fieldSchema.items) &&
        uiSchemaWithScope?.options?.format === 'checkbox';
    }
    return false;
  }
);

export default withJsonFormsControlProps(CheckboxRenderer);
