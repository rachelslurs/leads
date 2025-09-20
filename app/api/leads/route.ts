import { NextRequest, NextResponse } from 'next/server';
import { leadsStorage } from '@/lib/storage/leadsStorage';
import { processFormData, validateLeadData, createErrorResponse, createSuccessResponse } from '@/lib/api/formDataUtils';
import { LeadService } from '@/lib/services/leadService';
import { queryLeads } from '@/lib/utils/queryUtils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const processedData = processFormData(formData);
            const errors = await validateLeadData(processedData, false); // false indicates this is a create operation
    
    if (Object.keys(errors).length > 0) {
      return createErrorResponse(errors);
    }
    
    const leadData = LeadService.fromProcessedFormData(processedData);
    const newLead = LeadService.createLead(leadData);

    return createSuccessResponse({ leadId: newLead.id }, 'Lead created successfully');
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const sortField = searchParams.get('sortField') || 'submittedAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    const allLeads = leadsStorage.getAll();
    const result = queryLeads(allLeads, {
      page,
      limit,
      status: status || undefined,
      search,
      sortField,
      sortDirection: sortDirection as 'asc' | 'desc',
    });

    return NextResponse.json({
      success: true,
      leads: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}