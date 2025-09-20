'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { vanillaRenderers, vanillaCells } from '@jsonforms/vanilla-renderers';
import { Dice5Icon, Heart, InfoIcon } from 'lucide-react';
import { leadFormSchema } from './schema';
import { useCreateLeadMutation } from '@/lib/redux/leadsApi';
import FormHeader from './FormHeader';
import { FormProvider } from './FormContext';
import { FormData as FormDataType, FormChangeHandler, createJsonFormsChangeHandler } from './renderers/types';
import { JsonSchema } from '@jsonforms/core';
import { createFormChangeHandler } from './formHandlers';
import { isErrorWithData, isErrorWithMessage } from '@/lib/utils/typeGuards';

// Import custom renderers
import TextInputRenderer, { textInputControlTester } from './renderers/TextInputRenderer';
import TextAreaRenderer, { textAreaControlTester } from './renderers/TextAreaRenderer';
import SelectRenderer, { selectControlTester } from './renderers/SelectRenderer';
import FileUploadRenderer, { fileUploadControlTester } from './renderers/FileUploadRenderer';
import CheckboxRenderer, { checkboxControlTester } from './renderers/CheckboxRenderer';
import Container from '../layout/Container';
import InputWidth from '../layout/InputWidth';

const JsonLeadForm: React.FC = () => {
  const [data, setData] = useState<FormDataType>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createLead, { isLoading }] = useCreateLeadMutation();

  // Custom renderers for controls - memoized to prevent re-creation
  const customRenderers = useMemo(() => [
    { tester: fileUploadControlTester, renderer: FileUploadRenderer },
    { tester: checkboxControlTester, renderer: CheckboxRenderer },
    { tester: selectControlTester, renderer: SelectRenderer },
    { tester: textAreaControlTester, renderer: TextAreaRenderer },
    { tester: textInputControlTester, renderer: TextInputRenderer },
  ], []);

  // Combine custom renderers with vanilla renderers
  const allRenderers = useMemo(() => [
    ...customRenderers,
    ...vanillaRenderers,
  ], [customRenderers]);

  // Focused subschemas for different sections
  const basicInfoSchema = useMemo(() => ({
    type: 'object' as const,
    properties: {
      firstName: leadFormSchema.properties?.firstName || { type: 'string', title: 'First Name' },
      lastName: leadFormSchema.properties?.lastName || { type: 'string', title: 'Last Name' },
      email: leadFormSchema.properties?.email || { type: 'string', title: 'Email' },
      country: leadFormSchema.properties?.country || { type: 'string', title: 'Country' },
      linkedin: leadFormSchema.properties?.linkedin || { type: 'string', title: 'LinkedIn' },
    },
    required: leadFormSchema.required?.filter(field =>
      ['firstName', 'lastName', 'email', 'country', 'linkedin'].includes(field)
    ) || ['firstName', 'lastName', 'email', 'country', 'linkedin']
  } as JsonSchema), []);

  const basicInfoUISchema = useMemo(() => ({
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/firstName',
        options: { placeholder: 'First Name' },
      },
      {
        type: 'Control',
        scope: '#/properties/lastName',
        options: { placeholder: 'Last Name' },
      },
      {
        type: 'Control',
        scope: '#/properties/email',
        options: { placeholder: 'Email' },
      },
      {
        type: 'Control',
        scope: '#/properties/country',
        options: { format: 'select' },
      },
      {
        type: 'Control',
        scope: '#/properties/linkedin',
        options: { placeholder: 'Linkedin / Personal Website URL' },
      },
    ]
  }), []);

  const visaInterestsSchema = useMemo(() => ({
    type: 'object' as const,
    properties: {
      visaInterests: leadFormSchema.properties?.visaInterests || { type: 'array', title: 'Visa Interests' },
    },
    required: leadFormSchema.required?.filter(field =>
      ['visaInterests'].includes(field)
    ) || ['visaInterests']
  } as JsonSchema), []);

  const visaInterestsUISchema = useMemo(() => ({
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/visaInterests',
        options: { format: 'checkbox' },
      },
    ]
  }), []);

  const helpSectionSchema = useMemo(() => ({
    type: 'object' as const,
    properties: {
      longFormInput: leadFormSchema.properties?.longFormInput || { type: 'string', title: 'Long Form Input' },
      resume: leadFormSchema.properties?.resume || { type: 'string', title: 'Resume' },
    },
    required: leadFormSchema.required?.filter(field =>
      ['longFormInput', 'resume'].includes(field)
    ) || ['longFormInput', 'resume']
  } as JsonSchema), []);

  const helpSectionUISchema = useMemo(() => ({
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/longFormInput',
        options: {
          multi: true,
          placeholder: 'What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?',
        },
      },
      {
        type: 'Control',
        scope: '#/properties/resume',
        options: {
          format: 'file',
          accept: '.pdf,.doc,.docx',
          maxSize: 5242880, // 5MB
        },
      },
    ]
  }), []);

  // Config options for consistent behavior
  const formConfig = useMemo(() => ({
    restrict: false,
    trim: false,
    showUnfocusedDescription: true,
    hideRequiredAsterisk: false
  }), []);

  // Helper function to check if field has been touched
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const shouldShowError = (field: string) => {
    // Show errors for fields that have been touched, have content, or have server validation errors
    const hasBeenTouched = touchedFields.has(field);
    const hasContent = (data as Record<string, unknown>)[field] && String((data as Record<string, unknown>)[field]).length > 0;
    const hasServerError = errors[field] !== undefined;

    return hasBeenTouched || hasContent || hasServerError;
  };

  // Helper function to clear errors for a specific field
  const clearFieldError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Create the internal form change handler with proper types
  const internalFormChangeHandler: FormChangeHandler = ({ data: newData, errors: newErrors }) => {
    const handler = createFormChangeHandler({
      data: data as Record<string, unknown>,
      errors: Object.values(errors) as unknown[],
      setData: setData as (data: Record<string, unknown>) => void,
      setErrors,
      setSubmissionError,
      setTouchedFields,
      touchedFields,
      clearFieldError,
    });
    
    handler({ data: newData, errors: newErrors || [] });
  };

  // Create type-safe wrapper for JsonForms
  const handleFormChange = createJsonFormsChangeHandler(internalFormChangeHandler);

  // Effect to clear errors when form data becomes valid
  useEffect(() => {
    // Clear errors for fields that now have valid data
    setErrors(prev => {
      const newErrors = { ...prev };
      let hasChanges = false;

      Object.keys(prev).forEach(field => {
        const fieldValue = (data as Record<string, unknown>)[field];
        const isValid = fieldValue !== null && fieldValue !== undefined &&
          (typeof fieldValue === 'string' ? fieldValue.trim() !== '' : true) &&
          (Array.isArray(fieldValue) ? fieldValue.length > 0 : true);

        if (isValid && prev[field]) {
          delete newErrors[field];
          hasChanges = true;
        }
      });

      return hasChanges ? newErrors : prev;
    });
  }, [data]);

  // Function to handle field focus - clear errors for that field
  const handleFieldFocus = (fieldName: string) => {
    if (errors[fieldName]) {
      clearFieldError(fieldName);
    }
  };

  const handleSubmit = async () => {
    try {
      // Clear any previous submission errors
      setSubmissionError(null);

      const formData = new FormData();

      // Process all form data synchronously
      for (const [key, value] of Object.entries(data)) {
        if (key === 'resume' && typeof value === 'string' && value.startsWith('data:')) {
          // Convert data URL to file synchronously
          const response = await fetch(value);
          const blob = await response.blob();
          const file = new File([blob], 'resume.pdf', { type: blob.type });
          formData.append(key, file);
        } else if (key === 'visaInterests' && Array.isArray(value)) {
          // Handle array values by joining them
          formData.append(key, value.join(', '));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }

      // Ensure linkedin field is always sent (even if empty)
      if (!data.linkedin) {
        formData.append('linkedin', '');
      }

      await createLead(formData).unwrap();
      setData({});
      setErrors({});
      setSubmissionError(null);
      setShowConfirmation(true);
    } catch (error: unknown) {
      console.error('Submission error:', error);

      // Check if we have field-specific errors from the server
      if (isErrorWithData(error) && error.data.errors && typeof error.data.errors === 'object') {
        // Server returned field-specific errors
        setErrors(error.data.errors);
        setSubmissionError('Please fix the errors below');
      } else {
        // Fallback to general error message
        let errorMessage = 'Failed to submit form. Please try again.';

        if (isErrorWithData(error) && error.data.error) {
          errorMessage = error.data.error;
        } else if (isErrorWithMessage(error)) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        setSubmissionError(errorMessage);
      }
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex flex-col">

        <div className="flex-1 bg-purple-gradient flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 bg-alma-purple opacity-20 rounded-full"></div>
          <div className="absolute top-20 right-32 w-16 h-16 bg-alma-purple opacity-30 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-alma-purple opacity-25 rounded-full"></div>

          <div className="bg-white rounded-lg shadow-lg p-12 max-w-md w-full text-center relative z-10">
            <div className="mb-8">
              <div className="w-16 h-16 bg-alma-purple rounded-lg flex items-center justify-center mx-auto mb-6">
                <InfoIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information was submitted to our team of immigration attorneys.
                Expect an email from hello@tryalma.ai
              </p>
            </div>
            <button
              onClick={() => {
                setShowConfirmation(false);
                setData({});
                setErrors({});
                setSubmissionError(null);
                setTouchedFields(new Set());
              }}
              className="w-full bg-alma-gray text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Go Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <FormHeader />
      <Container>
        <FormProvider touchedFields={touchedFields} submissionError={submissionError} serverErrors={errors} onFieldFocus={handleFieldFocus}>
          <div className="bg-white p-8 relative z-10">
            <div className="mb-6 text-center">
              <div className="flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-alma-purple-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <InfoIcon className="w-6 h-6 text-alma-purple" />
                </div>
                <h3 className="font-bold text-alma-gray text-lg mb-2">
                  Want to understand your visa options?
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Submit the form below and our team of experienced attorneys will
                review your information and send a preliminary assessment of your
                case based on your goals.
              </p>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-4 mb-8">
              <InputWidth>
                <JsonForms
                  schema={basicInfoSchema}
                  uischema={basicInfoUISchema}
                  data={data}
                  renderers={allRenderers}
                  cells={vanillaCells}
                  config={formConfig}
                  onChange={handleFormChange}
                />
              </InputWidth>
            </div>

            {/* Visa Categories Section */}
            <div className="mb-8">
              <div className="flex-col items-center justify-center mb-4 text-center">
                <div className="w-12 h-12 bg-alma-purple-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Dice5Icon className="w-6 h-6 text-alma-purple" />
                </div>
                <h4 className="font-bold text-alma-gray text-lg">
                  Visa categories of interest?
                </h4>
              </div>
              <InputWidth>
                <JsonForms
                  schema={visaInterestsSchema}
                  uischema={visaInterestsUISchema}
                  data={data}
                  renderers={allRenderers}
                  cells={vanillaCells}
                  config={formConfig}
                  onChange={handleFormChange}
                />
              </InputWidth>
            </div>

            {/* How Can We Help Section */}
            <div className="mb-8">
              <div className="flex-col items-center justify-center mb-4 text-center">
                <div className="w-12 h-12 bg-alma-purple-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-alma-purple" />
                </div>
                <h4 className="font-bold text-alma-gray text-lg">
                  How can we help you?
                </h4>
              </div>
              <InputWidth>
                <JsonForms
                  schema={helpSectionSchema}
                  uischema={helpSectionUISchema}
                  data={data}
                  renderers={allRenderers}
                  cells={vanillaCells}
                  config={formConfig}
                  onChange={handleFormChange}
                />
              </InputWidth>
            </div>

            {/* Show validation errors if any */}
            {(() => {
              const visibleErrors = Object.entries(errors).filter(([field]) =>
                shouldShowError(field)
              );

              return visibleErrors.length > 0 && (
                <InputWidth>
                  <div className="mb-4 p-3 bg-red-50 border border-alma-error rounded-lg">
                    <p className="text-sm text-alma-error font-medium mb-1">Please fix the following errors:</p>
                    <ul className="text-sm text-alma-error list-disc list-inside">
                      {visibleErrors.map(([field, errorMessage]) => (
                        <li key={field}>
                          {field}: {String(errorMessage)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </InputWidth>
              );
            })()}


            <InputWidth>
              <button
                onClick={handleSubmit}
                disabled={isLoading || Object.keys(errors).some(field =>
                  ['firstName', 'lastName', 'email', 'country', 'linkedin', 'visaInterests', 'longFormInput', 'resume'].includes(field)
                )}
                className="w-full mt-6 bg-alma-gray text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </InputWidth>
          </div>
        </FormProvider>
      </Container>
    </div>
  );
};

export default JsonLeadForm;