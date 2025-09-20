'use client';
import React, { useState } from 'react';
import { useGetLeadsQuery, useUpdateLeadStatusMutation } from '@/lib/redux/leadsApi';
import { Lead } from '@/lib/types/lead';
import SearchAndFilter from './SearchAndFilter';
import LeadsTable from './LeadsTable';
import Pagination from './Pagination';
import Notification from '../ui/Notification';

const LeadsDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { data, isLoading, error } = useGetLeadsQuery({
    page: currentPage,
    limit: 8,
    status: statusFilter,
    search: searchQuery,
    sortField,
    sortDirection,
  });

  const [updateStatus] = useUpdateLeadStatusMutation();

  // Reset pagination when filters or search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page
  };

  const handleStatusChange = async (leadId: string, newStatus: string, lead: Lead) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await updateStatus({ 
        id: leadId, 
        status: newStatus,
        leadData: {
          name: lead.name,
          email: lead.email,
          linkedin: lead.linkedin,
          visaInterests: lead.visaInterests,
          longFormInput: lead.longFormInput,
        }
      }).unwrap();
      
      setSuccessMessage(`Lead status updated to ${newStatus} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      console.error('Failed to update status:', error);
      const errorMsg = (error as { data?: { error?: string }; message?: string })?.data?.error || 
                      (error as { message?: string })?.message || 
                      'Failed to update lead status';
      setErrorMessage(errorMsg);
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-alma-error p-8">
        Error loading leads. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Notifications */}
      {errorMessage && (
        <Notification
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      
      {successMessage && (
        <Notification
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {/* Leads Table */}
      <LeadsTable
        leads={data?.leads || []}
        onStatusChange={handleStatusChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={data.pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default LeadsDashboard;