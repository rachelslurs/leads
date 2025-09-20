export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    country: string;
    linkedin?: string;
    visaInterests: string;
    longFormInput: string;
    resumeUrl?: string;
    resumeFileName?: string;
    status: 'PENDING' | 'REACHED_OUT';
    submittedAt: string;
  }
  
  export interface LeadFormData {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    country: string;
    linkedin?: string;
    visaInterests: string;
    longFormInput: string;
    resume: File | null;
  }
  
  export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
  
  export interface LeadsResponse {
    leads: Lead[];
    pagination: PaginationInfo;
  }