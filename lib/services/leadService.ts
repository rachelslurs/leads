// Business logic service layer for lead operations

import { Lead } from '@/lib/types/lead';
import { leadsStorage } from '@/lib/storage/leadsStorage';
import { ProcessedFormData } from '@/lib/api/formDataUtils';
import { generateFileUrl } from '@/lib/utils/fileUtils';

export interface CreateLeadData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedin: string;
  visaInterests: string;
  longFormInput: string;
  resumeFile?: File;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  status?: string;
}

export class LeadService {
  // Create a new lead
  static createLead(data: CreateLeadData): Lead {
    const resumeUrl = data.resumeFile ? generateFileUrl(data.resumeFile.name) : '';
    const resumeFileName = data.resumeFile ? data.resumeFile.name : '';

    const newLead: Lead = {
      id: leadsStorage.getNextId().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      country: data.country,
      linkedin: data.linkedin,
      visaInterests: data.visaInterests,
      longFormInput: data.longFormInput,
      resumeUrl,
      resumeFileName,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    };

    leadsStorage.add(newLead);
    return newLead;
  }

  // Update an existing lead
  static updateLead(id: string, data: UpdateLeadData): Lead | null {
    const existingLead = leadsStorage.getById(id);
    if (!existingLead) {
      return null;
    }

    // Handle file upload - only update if new file is provided
    let resumeUrl = existingLead.resumeUrl;
    let resumeFileName = existingLead.resumeFileName;
    
    if (data.resumeFile && data.resumeFile.size > 0) {
      resumeFileName = data.resumeFile.name;
      resumeUrl = generateFileUrl(data.resumeFile.name);
    }

    // Update the lead with new data while preserving existing fields
    const updatedLead: Lead = {
      ...existingLead,
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.firstName && data.lastName && { name: `${data.firstName} ${data.lastName}`.trim() }),
      ...(data.email && { email: data.email }),
      ...(data.country && { country: data.country }),
      ...(data.linkedin && { linkedin: data.linkedin }),
      ...(data.visaInterests && { visaInterests: data.visaInterests }),
      ...(data.longFormInput && { longFormInput: data.longFormInput }),
      ...(data.status && { status: data.status as 'PENDING' | 'REACHED_OUT' }),
      resumeUrl,
      resumeFileName,
    };

    const leadIndex = leadsStorage.findIndex(id);
    leadsStorage.update(leadIndex, updatedLead);
    return updatedLead;
  }

  // Get lead by ID
  static getLeadById(id: string): Lead | null {
    return leadsStorage.getById(id) || null;
  }

  // Get all leads
  static getAllLeads(): Lead[] {
    return leadsStorage.getAll();
  }

  // Check if lead exists
  static leadExists(id: string): boolean {
    return leadsStorage.getById(id) !== undefined;
  }

  // Convert ProcessedFormData to CreateLeadData
  static fromProcessedFormData(data: ProcessedFormData): CreateLeadData {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      country: data.country,
      linkedin: data.linkedin,
      visaInterests: data.visaInterests,
      longFormInput: data.longFormInput,
      resumeFile: data.resumeFile || undefined,
    };
  }
}
