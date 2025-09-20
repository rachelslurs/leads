import { Lead } from '@/lib/types/lead';

// Use global variables to ensure sharing across all API routes
declare global {
  var __leads_storage: Lead[] | undefined;
  var __leads_next_id: number | undefined;
}

// Initialize global storage if not exists
if (!global.__leads_storage) {
  global.__leads_storage = [];
  global.__leads_next_id = 1;
}

const leads = global.__leads_storage;
// const nextId = global.__leads_next_id;

export const leadsStorage = {
  // Get all leads
  getAll: (): Lead[] => leads,
  
  // Get a lead by ID
  getById: (id: string): Lead | undefined => leads.find(lead => lead.id === id),
  
  // Find lead index by ID
  findIndex: (id: string): number => leads.findIndex(lead => lead.id === id),
  
  // Add a new lead
  add: (lead: Lead): void => {
    leads.push(lead);
  },
  
  // Update a lead by index
  update: (index: number, lead: Lead): void => {
    if (index >= 0 && index < leads.length) {
      leads[index] = lead;
    }
  },
  
  // Get next ID
  getNextId: (): number => {
    const currentId = global.__leads_next_id!;
    global.__leads_next_id!++;
    return currentId;
  },
  
  // Set next ID (useful for testing)
  setNextId: (id: number): void => {
    global.__leads_next_id = id;
  },
  
  // Clear all leads (useful for testing)
  clear: (): void => {
    global.__leads_storage = [];
    global.__leads_next_id = 1;
  }
};
