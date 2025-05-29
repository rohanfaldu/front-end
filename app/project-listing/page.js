'use client';

import DeleteFile from "@/components/elements/DeleteFile";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import CommonTable from "@/components/common/CommonTable";
import { insertData, deletedData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import React, { useState, useEffect } from 'react';
import variablesList from "@/components/common/Variable";

export default function ProjectListing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: variablesList.currentPage || 1,
    totalPages: 1,
    totalCount: 0,
    itemsPerPage: 1
  });

  const fetchProperties = async (page = 1, term = '', status = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        lang: "en",
        searchTerm: term,
        status,
      };

      console.log('Fetching properties with:', requestData);
      
      const response = await insertData("api/projects/developer", requestData, true);
      
      console.log('API Response:', response);
      
      if (response && response.status) {
        const { list = [], totalCount = 0, totalPages = 1, currentPage = 1 } = response.data || {};
        
        console.log('Setting properties:', list);
        
        setProperties(list);
        setPagination(prev => ({
          ...prev,
          totalCount,
          totalPages,
          currentPage,
        }));
      } else {
        console.error('API response indicates failure:', response);
        setError(response?.message || "Failed to fetch data");
        setProperties([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || "An error occurred");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(pagination.currentPage, searchTerm, statusFilter);
  }, []); // Only run on mount

  // Separate effect for pagination, search, and filter changes
  useEffect(() => {
    if (pagination.currentPage > 1 || searchTerm || statusFilter) {
      fetchProperties(pagination.currentPage, searchTerm, statusFilter);
    }
  }, [pagination.currentPage, searchTerm, statusFilter]);

  const handleDelete = async (item) => {
    if (!item || !item.id) {
      alert('Invalid item selected for deletion');
      return false;
    }

    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete "${item.title || 'this item'}"?`)) {
      return false;
    }

    try {
      const response = await deletedData(`api/projects/${item.id}`, { propertyId: item.id });
      if (response && response.status) {
        // Refresh the data after deletion
        await fetchProperties(pagination.currentPage, searchTerm, statusFilter);
        return true;
      } else {
        alert(response?.message || "Failed to delete item");
        return false;
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || err.message || "An error occurred during deletion");
      return false;
    }
  };

  const handleView = (item) => {
    if (!item || !item.slug) {
      alert('Invalid item - cannot view');
      return;
    }
    const URL = `${process.env.NEXT_PUBLIC_SITE_URL}/project/${item.slug}`;
    window.open(URL, '_blank');
  };

  const handleEdit = (item) => {
    if (!item || !item.slug) {
      alert('Invalid item - cannot edit');
      return;
    }
    window.location.href = `/edit-project/${item.slug}`;
  };

  const handleSearch = (term) => {
    console.log('Search term:', term);
    setSearchTerm(term);
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page when searching
    }));
  };

  const handleFilter = (status) => {
    console.log('Filter status:', status);
    setStatusFilter(status);
    setPagination(prev => ({
      ...prev,
      currentPage: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page) => {
    console.log('Page change:', page);
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page
      }));
    }
  };

  const columns = [
    {
      key: 'user_image',
      header: 'Image',
      type: 'image'
    },
    {
      key: 'title',
      header: 'Title'
    },
    {
      key: 'user_name',
      header: 'User name'
    },
    {
      key: 'created_at',
      header: 'Date Published',
      type: 'date'
    },
    {
      key: 'status',
      header: 'Status',
      type: 'status'
    },
    {
      key: 'actions',
      header: 'Action',
      type: 'actions'
    }
  ];

  console.log('Current state:', {
    properties: properties,
    loading: loading,
    error: error,
    pagination: pagination
  });

  // Show error state
  if (error && !loading) {
    return (
      <LayoutAdmin>
        <div className="wrap-dashboard-content">
          <div className="widget-box-2 wd-listing">
            <div className="p-6 text-center">
              <div className="text-red-600 mb-4">Error: {error}</div>
              <button 
                onClick={() => fetchProperties(1, '', '')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <>
      <DeleteFile />
      <LayoutAdmin>
        <div className="wrap-dashboard-content">
          <div className="listing-data-sec">
            <CommonTable
              title="Project Listing"
              data={properties || []} // Ensure data is always an array
              loading={loading}
              columns={columns}
              searchable={true}
              filterable={true}
              pagination={pagination}
              onSearch={handleSearch}
              onFilter={handleFilter}
              onPageChange={handlePageChange}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              addButtonText="Add Project"
              SubText="Project List"
              addButtonLink="/create-project"
              filterOptions={[
                { value: '', label: 'All' }, // Added 'All' option
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              emptyMessage={loading ? "Loading..." : "No projects found"}
            />
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
}