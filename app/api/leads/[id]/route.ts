import { NextRequest, NextResponse } from 'next/server';
import { Lead } from '@/lib/types/lead';
import { leadsStorage } from '@/lib/storage/leadsStorage';
import { processFormData, validateLeadData, createErrorResponse, createSuccessResponse } from '@/lib/api/formDataUtils';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const formData = await request.formData();
    const { id } = await params;
    
    const leadIndex = leadsStorage.findIndex(id);

    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Get the existing lead
    const existingLead = leadsStorage.getById(id);
    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Check if status is being updated
    const statusUpdate = formData.get('status') as string;
    const processedData = processFormData(formData);
    
    // Check if this is a status-only update (only status field is provided)
    const isStatusOnlyUpdate = statusUpdate && !processedData.firstName && !processedData.lastName && !processedData.email && !processedData.country && !processedData.visaInterests && !processedData.longFormInput && !processedData.resumeFile;

    // Basic validation - only validate required fields if this is not a status-only update
    if (!isStatusOnlyUpdate) {
      const errors = await validateLeadData(processedData, true); // true indicates this is an update
      if (Object.keys(errors).length > 0) {
        return createErrorResponse(errors);
      }
    }

    // Handle file upload - only update if new file is provided
    let resumeUrl = existingLead.resumeUrl;
    let resumeFileName = existingLead.resumeFileName;
    
    if (processedData.resumeFile && processedData.resumeFile.size > 0) {
      // For MVP, we'll just store file info (in production, save to cloud storage)
      resumeFileName = processedData.resumeFile.name;
      resumeUrl = `/uploads/${Date.now()}-${processedData.resumeFile.name}`;
    }

    // Update the lead with new data while preserving existing fields
    const updatedLead: Lead = {
      ...existingLead,
      // Update fields only if they have values (not empty strings)
      ...(processedData.firstName && { firstName: processedData.firstName }),
      ...(processedData.lastName && { lastName: processedData.lastName }),
      ...(processedData.firstName && processedData.lastName && { name: processedData.name }),
      ...(processedData.email && { email: processedData.email }),
      ...(processedData.country && { country: processedData.country }),
      ...(processedData.linkedin && { linkedin: processedData.linkedin }),
      ...(processedData.visaInterests && { visaInterests: processedData.visaInterests }),
      ...(processedData.longFormInput && { longFormInput: processedData.longFormInput }),
      resumeUrl,
      resumeFileName,
      // Update status if provided, otherwise keep existing status
      status: statusUpdate ? (statusUpdate as 'PENDING' | 'REACHED_OUT') : existingLead.status,
      // Preserve original submission date
      submittedAt: existingLead.submittedAt,
    };

    leadsStorage.update(leadIndex, updatedLead);

    return createSuccessResponse({ lead: updatedLead }, 'Lead updated successfully');
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}