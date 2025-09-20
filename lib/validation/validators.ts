// Centralized validation functions for consistent validation across client and server

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface FieldValidator {
  (value: string | string[] | File | null | undefined): ValidationResult;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, errorMessage: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, errorMessage: 'URL is required' };
  }
  
  const trimmedUrl = url.trim();
  
  // Check if it starts with http:// or https://
  if (!trimmedUrl.startsWith('https://') && !trimmedUrl.startsWith('http://')) {
    return { isValid: false, errorMessage: 'Please enter a valid URL starting with http:// or https://' };
  }
  
  // Check if there's something after the protocol
  if (trimmedUrl === 'https://' || trimmedUrl === 'http://') {
    return { isValid: false, errorMessage: 'Please enter a valid URL' };
  }
  
  // More strict validation - require a proper domain structure
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Check if hostname has at least one dot (for proper domain) or is localhost
    const hostname = urlObj.hostname;
    if (!hostname.includes('.') && hostname !== 'localhost') {
      return { isValid: false, errorMessage: 'Please enter a valid URL with a proper domain (e.g., example.com)' };
    }
    
    // Check if hostname is not just a single word without extension
    if (hostname.match(/^[a-zA-Z]+$/)) {
      return { isValid: false, errorMessage: 'Please enter a valid URL with a proper domain (e.g., example.com)' };
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, errorMessage: 'Please enter a valid URL' };
  }
};

// Required field validation
export const validateRequired = (value: string | string[] | File | null | undefined, fieldName: string): ValidationResult => {
  if (!value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0)) {
    return { isValid: false, errorMessage: `${fieldName} is required` };
  }
  return { isValid: true };
};

// File validation
export const validateFile = (file: File | null | undefined): ValidationResult => {
  if (!file) {
    return { isValid: false, errorMessage: 'File is required' };
  }
  
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, errorMessage: 'Please upload a PDF, DOC, or DOCX file' };
  }

  if (file.size > maxSize) {
    return { isValid: false, errorMessage: 'File size must be less than 5MB' };
  }

  return { isValid: true };
};

// Visa interests validation
export const validateVisaInterests = (interests: string | string[] | null | undefined): ValidationResult => {
  if (!interests || (Array.isArray(interests) && interests.length === 0)) {
    return { isValid: false, errorMessage: 'Please select at least one visa type' };
  }
  return { isValid: true };
};

// Combined validation for all lead fields
export const validateLeadField = (fieldName: string, value: string | string[] | File | null | undefined): ValidationResult => {
  switch (fieldName) {
    case 'firstName':
    case 'lastName':
    case 'country':
    case 'longFormInput':
      return validateRequired(value, fieldName);
    
    case 'email':
      return validateEmail(value as string);
    
    case 'linkedin':
      return validateUrl(value as string);
    
    case 'visaInterests':
      return validateVisaInterests(value as string | string[] | null | undefined);
    
    case 'resume':
      return validateFile(value as File);
    
    default:
      return { isValid: true };
  }
};
