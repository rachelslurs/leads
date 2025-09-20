// Form data processing utilities for API routes

export interface ProcessedFormData {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  country: string;
  linkedin: string;
  visaInterests: string;
  longFormInput: string;
  resumeFile: File | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function processFormData(formData: FormData): ProcessedFormData {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const country = formData.get('country') as string;
  const linkedin = formData.get('linkedin') as string;
  const visaInterests = formData.get('visaInterests') as string;
  const longFormInput = formData.get('longFormInput') as string;
  const resumeFile = formData.get('resume') as File;

  return {
    firstName: firstName || '',
    lastName: lastName || '',
    name: firstName && lastName ? `${firstName} ${lastName}`.trim() : '',
    email: email || '',
    country: country || '',
    linkedin: linkedin || '',
    visaInterests: visaInterests || '',
    longFormInput: longFormInput || '',
    resumeFile: resumeFile || null,
  };
}

export async function validateLeadData(data: ProcessedFormData, isUpdate: boolean = false): Promise<ValidationErrors> {
  const errors: ValidationErrors = {};
  
  // For updates, only validate fields that are being provided (non-empty)
  // For creates, validate all required fields
  
  if (data.firstName && (!isUpdate || data.firstName.trim() !== '')) {
    if (!data.firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
  } else if (!isUpdate) {
    errors.firstName = 'First Name is required';
  }
  
  if (data.lastName && (!isUpdate || data.lastName.trim() !== '')) {
    if (!data.lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }
  } else if (!isUpdate) {
    errors.lastName = 'Last Name is required';
  }
  
  if (data.email && (!isUpdate || data.email.trim() !== '')) {
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  } else if (!isUpdate) {
    errors.email = 'Email is required';
  }
  
  if (data.country && (!isUpdate || data.country.trim() !== '')) {
    if (!data.country.trim()) {
      errors.country = 'Country of Citizenship is required';
    }
  } else if (!isUpdate) {
    errors.country = 'Country of Citizenship is required';
  }
  
  if (data.linkedin && (!isUpdate || data.linkedin.trim() !== '')) {
    if (!data.linkedin.trim()) {
      errors.linkedin = 'LinkedIn / Personal Website URL is required';
    } else {
      // Use centralized validation
      const { validateUrl } = await import('@/lib/validation/validators');
      const result = validateUrl(data.linkedin);
      if (!result.isValid) {
        errors.linkedin = result.errorMessage || 'Please enter a valid URL';
      }
    }
  } else if (!isUpdate) {
    errors.linkedin = 'LinkedIn / Personal Website URL is required';
  }
  
  if (data.visaInterests && (!isUpdate || data.visaInterests.trim() !== '')) {
    if (!data.visaInterests.trim()) {
      errors.visaInterests = 'Please select at least one visa type';
    }
  } else if (!isUpdate) {
    errors.visaInterests = 'Please select at least one visa type';
  }
  
  if (data.longFormInput && (!isUpdate || data.longFormInput.trim() !== '')) {
    if (!data.longFormInput.trim()) {
      errors.longFormInput = 'Please provide details about how we can help you';
    }
  } else if (!isUpdate) {
    errors.longFormInput = 'Please provide details about how we can help you';
  }
  
  if (data.resumeFile && (!isUpdate || data.resumeFile.size > 0)) {
    // Validate file if provided
    const { validateFile } = await import('@/lib/validation/validators');
    const result = validateFile(data.resumeFile);
    if (!result.isValid) {
      errors.resume = result.errorMessage || 'Please upload a valid file';
    }
  } else if (!isUpdate) {
    errors.resume = 'Resume / CV is required';
  }
  
  return errors;
}

export function createErrorResponse(errors: ValidationErrors, status: number = 400) {
  return Response.json(
    { success: false, errors },
    { status }
  );
}

export function createSuccessResponse(data: Record<string, unknown>, message: string) {
  return Response.json({
    success: true,
    ...data,
    message
  });
}
