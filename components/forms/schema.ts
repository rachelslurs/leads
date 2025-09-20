import { JsonSchema, JsonSchema7 } from '@jsonforms/core';

export const leadFormSchema: JsonSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      minLength: 1,
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      minLength: 1,
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
    },
    country: {
      type: 'string',
      title: 'Country of Citizenship',
      enum: [
        'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Ireland', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'Taiwan', 'Israel', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Uruguay', 'Paraguay', 'Ecuador', 'Bolivia', 'India', 'China', 'Russia', 'Ukraine', 'Turkey', 'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Tunisia', 'Algeria', 'Other'
      ],
    },
    linkedin: {
      type: 'string',
      title: 'Linkedin / Personal Website URL',
      format: 'uri',
      description: 'Your LinkedIn profile or personal website URL',
    },
    visaInterests: {
      type: 'array',
      title: 'Visa categories of interest?',
      items: {
        type: 'string',
        enum: ['O-1', 'EB-1A', 'EB-2 NIW', 'I don\'t know'],
      },
      minItems: 1,
      uniqueItems: true,
    },
    longFormInput: {
      type: 'string',
      title: 'How can we help you?',
    },
    resume: {
      type: 'string',
      title: 'Resume / CV (file upload)',
      'x-file-upload': true,
    } as JsonSchema7 & { 'x-file-upload': true },
  },
  required: ['firstName', 'lastName', 'email', 'country', 'linkedin', 'visaInterests', 'longFormInput', 'resume'],
};
