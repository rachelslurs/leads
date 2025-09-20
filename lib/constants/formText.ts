// Form text constants for consistent messaging across the application

export const FORM_LABELS = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  country: 'Country',
  linkedin: 'LinkedIn URL',
  visaInterests: 'Visa Interests',
  longFormInput: 'How can we help you',
  resume: 'Resume'
} as const;

export const ERROR_MESSAGES = {
  // Required field errors
  required: 'This field is required',
  requiredField: (fieldName: string) => `${fieldName} is required`,
  
  // Email validation
  invalidEmail: 'Please enter a valid email address',
  
  // URL validation
  invalidUrl: 'Please enter a valid URL starting with http:// or https://',
  invalidUrlFormat: 'Please enter a valid URL with a proper domain (e.g., example.com)',
  
  // File validation
  fileRequired: 'File is required',
  invalidFileType: 'Please upload a PDF, DOC, or DOCX file',
  fileTooLarge: 'File size must be less than 5MB',
  
  // Array/selection validation
  selectAtLeastOne: 'Please select at least one option',
  selectAtLeastOneVisa: 'Please select at least one visa type',
  invalidSelection: 'Please select a valid option',
  
  // Generic validation
  invalidValue: 'Invalid value',
  
  // Submission errors
  submissionFailed: 'Failed to submit form. Please try again.',
  fixErrorsBelow: 'Please fix the errors below',
  fixFollowingErrors: 'Please fix the following errors:'
} as const;

export const FORM_PLACEHOLDERS = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  linkedin: 'Linkedin / Personal Website URL',
  longFormInput: 'What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?'
} as const;

export const FORM_TITLES = {
  basicInfo: 'Want to understand your visa options?',
  visaCategories: 'Visa categories of interest?',
  helpSection: 'How can we help you?',
  thankYou: 'Thank You',
  submissionSuccess: 'Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai'
} as const;

export const BUTTON_TEXT = {
  submit: 'Submit',
  submitting: 'Submitting...',
  goBackToHomepage: 'Go Back to Homepage',
  signIn: 'Sign in',
  signingIn: 'Signing in...'
} as const;

export const ACCESSIBILITY_LABELS = {
  required: ' (required)',
  createLabel: (title: string, isRequired: boolean) => `${title}${isRequired ? ' (required)' : ''}`
} as const;
