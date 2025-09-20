'use client';
import React, { useState } from 'react';
import { rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useFormContext } from '../FormContext';
import { BaseRendererProps, UISchemaElementWithScope, JsonSchemaWithCustom, hasFileUploadProperty } from './types';
import { getErrorState, createAccessibleLabel } from './errorUtils';
import { validateFile as validateFileUtil } from '@/lib/validation/validators';

interface FileUploadRendererProps extends BaseRendererProps {
  data: string;
}

const FileUploadRenderer = ({
  data,
  handleChange,
  path,
  errors,
  schema,
}: FileUploadRendererProps) => {
  const context = useFormContext();
  const [file, setFile] = useState<File | null>(null);
  const [customError, setCustomError] = useState<string>('');

  const validateFile = (selectedFile: File): boolean => {
    // Use centralized validation
    const result = validateFileUtil(selectedFile);
    if (!result.isValid) {
      setCustomError(result.errorMessage || 'Invalid file');
      return false;
    } else {
      setCustomError('');
      return true;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      // Convert to data URL for JsonForms
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleChange(path, reader.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Use shared error handling
  const fieldName = path.split('.').pop() || '';
  const errorState = getErrorState(fieldName, data, errors, context, customError);
  const isRequired = schema.required?.includes(path.split('.').pop() || '') || false;

  // Create accessible label
  const accessibleLabel = createAccessibleLabel(schema.title || '', isRequired);

  return (
    <div className="mb-4">
      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        errorState.hasError ? 'border-alma-error' : 'border-gray-300 hover:border-alma-purple'
      }`}>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
          id={`file-upload-${path}`}
          aria-label={accessibleLabel}
          aria-required={isRequired}
          aria-invalid={errorState.hasError}
        />
        
        <label htmlFor={`file-upload-${path}`} className="cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          {file ? (
            <div className="text-sm text-alma-gray">
              <div className="flex items-center justify-center mb-1">
                <FileText className="w-4 h-4 mr-1" />
                {file.name}
              </div>
              <div className="text-gray-500">
                {formatFileSize(file.size)}
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-alma-gray">Click to upload your resume</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, or DOCX up to 5MB</p>
            </>
          )}
        </label>
      </div>
      
      {errorState.hasError && (
        <p className="mt-1 text-sm text-alma-error flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errorState.errorMessage || `${schema.title} is required`}
        </p>
      )}
    </div>
  );
};

export const fileUploadControlTester = rankWith(
  10,
  (uischema, schema): boolean => {
    const uiSchemaWithScope = uischema as UISchemaElementWithScope;
    if (uiSchemaWithScope?.scope) {
      const path = uiSchemaWithScope.scope.replace('#/properties/', '');
      const fieldSchema = (schema as JsonSchemaWithCustom)?.properties?.[path];
      return fieldSchema?.type === 'string' && 
             hasFileUploadProperty(fieldSchema);
    }
    return false;
  }
);

export default withJsonFormsControlProps(FileUploadRenderer);