// Query utilities for search, filter, and sort operations

import { Lead } from '@/lib/types/lead';

export interface QueryOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface QueryResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class QueryBuilder<T> {
  private data: T[];
  private filteredData: T[];

  constructor(data: T[]) {
    this.data = data;
    this.filteredData = [...data];
  }

  // Apply status filter
  filterByStatus(status: string): this {
    if (status && status !== 'ALL') {
      this.filteredData = this.filteredData.filter((item: T) => (item as Record<string, unknown>).status === status);
    }
    return this;
  }

  // Apply search filter
  search(searchTerm: string, searchFields: (keyof T)[]): this {
    if (searchTerm && searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      this.filteredData = this.filteredData.filter((item: T) =>
        searchFields.some(field => {
          const value = (item as Record<string, unknown>)[field as string];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }
    return this;
  }

  // Apply sorting
  sort(field: keyof T, direction: 'asc' | 'desc' = 'asc'): this {
    this.filteredData.sort((a: T, b: T) => {
      let aValue: string | number = (a as Record<string, unknown>)[field as string] as string | number;
      let bValue: string | number = (b as Record<string, unknown>)[field as string] as string | number;

      // Handle date fields
      if (field === 'submittedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return this;
  }

  // Apply pagination
  paginate(page: number = 1, limit: number = 10): QueryResult<T> {
    const total = this.filteredData.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = this.filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  // Get all filtered data without pagination
  getAll(): T[] {
    return this.filteredData;
  }

  // Get count of filtered data
  getCount(): number {
    return this.filteredData.length;
  }
}

// Convenience function for lead queries
export const queryLeads = (leads: Lead[], options: QueryOptions = {}): QueryResult<Lead> => {
  const {
    page = 1,
    limit = 10,
    status,
    search = '',
    sortField = 'submittedAt',
    sortDirection = 'desc',
  } = options;

  const searchFields: (keyof Lead)[] = ['name', 'email', 'country', 'visaInterests'];

  return new QueryBuilder(leads)
    .filterByStatus(status || '')
    .search(search, searchFields)
    .sort(sortField as keyof Lead, sortDirection)
    .paginate(page, limit);
};

// Default search fields for leads
export const LEAD_SEARCH_FIELDS: (keyof Lead)[] = ['name', 'email', 'country', 'visaInterests'];

// Available sort fields for leads
export const LEAD_SORT_FIELDS = ['name', 'submittedAt', 'status', 'country'] as const;
export type LeadSortField = typeof LEAD_SORT_FIELDS[number];
