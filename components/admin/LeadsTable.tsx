'use client';
import React, { useState, useMemo } from 'react';
import { Lead } from '@/lib/types/lead';
import { ArrowUp, ArrowDown } from 'lucide-react';

type SortField = 'name' | 'submittedAt' | 'status' | 'country';

interface LeadsTableProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: string, lead: Lead) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ 
  leads, 
  onStatusChange, 
  sortField, 
  sortDirection, 
  onSortChange 
}) => {
  const [animatingLeads, setAnimatingLeads] = useState<Set<string>>(new Set());

  const handleStatusChangeWithAnimation = async (leadId: string, newStatus: string, lead: Lead) => {
    // Add to animating set
    setAnimatingLeads(prev => new Set(prev).add(leadId));
    
    // Call the original handler
    await onStatusChange(leadId, newStatus, lead);
    
    // Remove from animating set after animation
    setTimeout(() => {
      setAnimatingLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }, 300);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 text-gray-600" />
      : <ArrowDown className="ml-1 h-4 w-4 text-gray-600" />;
  };

  // Ensure we always show exactly 8 rows by padding with empty rows if needed
  const displayLeads = useMemo(() => {
    const paddedLeads: (Lead | null)[] = [...leads];
    while (paddedLeads.length < 8) {
      paddedLeads.push(null);
    }
    return paddedLeads.slice(0, 8);
  }, [leads]);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center hover:text-gray-700 transition-colors w-full"
              >
                Name
                {getSortIcon('name')}
              </button>
            </th>
            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('submittedAt')}
                className="flex items-center hover:text-gray-700 transition-colors w-full"
              >
                Submitted
                {getSortIcon('submittedAt')}
              </button>
            </th>
            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('status')}
                className="flex items-center hover:text-gray-700 transition-colors w-full"
              >
                Status
                {getSortIcon('status')}
              </button>
            </th>
            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('country')}
                className="flex items-center hover:text-gray-700 transition-colors w-full"
              >
                Country
                {getSortIcon('country')}
              </button>
            </th>
            <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayLeads.map((lead, index) => {
            const isAnimating = lead && animatingLeads.has(lead.id);
            
            return (
              <tr 
                key={lead?.id || `empty-${index}`} 
                className={`hover:bg-gray-50 transition-all duration-300 ${
                  isAnimating ? 'bg-blue-50 scale-105' : ''
                }`}
              >
              <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                {lead ? (
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                ) : (
                  <div className="text-sm text-gray-400">&nbsp;</div>
                )}
              </td>
              <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead ? formatDate(lead.submittedAt) : <span className="text-gray-400">&nbsp;</span>}
              </td>
              <td className="w-1/6 px-6 py-4 whitespace-nowrap">
                {lead ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    lead.status === 'PENDING' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {lead.status === 'PENDING' ? 'Pending' : 'Reached Out'}
                  </span>
                ) : (
                  <span className="text-gray-400">&nbsp;</span>
                )}
              </td>
              <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead ? lead.country : <span className="text-gray-400">&nbsp;</span>}
              </td>
              <td className="w-1/6 px-6 py-4 whitespace-nowrap text-sm font-medium">
                {lead ? (
                  <button
                    onClick={() => handleStatusChangeWithAnimation(
                      lead.id, 
                      lead.status === 'PENDING' ? 'REACHED_OUT' : 'PENDING',
                      lead
                    )}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-300 ${
                      lead.status === 'PENDING'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    } ${
                      isAnimating ? 'animate-pulse' : ''
                    }`}
                  >
                    {lead.status === 'PENDING' ? 'Mark as Reached Out' : 'Mark as Pending'}
                  </button>
                ) : (
                  <span className="text-gray-400">&nbsp;</span>
                )}
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
