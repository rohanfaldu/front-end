import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Edit, Eye, Trash2, Plus, Filter } from 'lucide-react';
import Preloader from '../elements/Preloader';
const CommonTable = ({
  title = "Table",
  SubText = "",
  data = [],
  columns = [],
  loading = false,
  searchable = false,
  filterable = false,
  pagination = { currentPage: 1, totalPages: 1, totalCount: 0, itemsPerPage: 1 },
  onSearch = () => {},
  onFilter = () => {},
  onPageChange = () => {},
  onEdit = () => {},
  onView = () => {},
  onDelete = () => {},
  addButtonText = "Add Item",
  addButtonLink = "#",
  filterOptions = [],
  customTitle = null,
  emptyMessage = "No data available"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('CommonTable received data:', data);
    console.log('CommonTable loading state:', loading);
    console.log('CommonTable pagination:', pagination);
  }, [data, loading, pagination]);

  const handleSearch = () => {
    console.log('Searching with term:', searchTerm);
    onSearch(searchTerm);
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterSelect = (filterValue) => {
    console.log('Filter selected:', filterValue);
    setSelectedFilter(filterValue);
    onFilter(filterValue);
    setShowFilterDropdown(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const handleDeleteClick = async (item) => {
    try {
      const result = await onDelete(item);
      if (result) {
        console.log('Item deleted successfully');
      }
    } catch (error) {
      console.error('Delete operation failed:', error);
    }
  };

  const renderCellContent = (item, column) => {
    if (!item) return 'N/A';
    
    const value = item[column.key];
    
    // Handle custom render function
    if (column.type === 'custom' && column.render) {
      return column.render(item);
    }
    
    switch (column.type) {
      case 'image':
        return (
          <div className="image-cell-container">
            <div className="avatar-wrapper">
              {value ? (
                <img 
                  src={value} 
                  alt="Avatar" 
                  className="avatar-image"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  <svg className="avatar-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'status':
        const statusValue = value ? String(value).toLowerCase() : '';
        return (
          <span className={`status-badge ${
            statusValue 
              ? 'status-active' 
              : !statusValue 
              ? 'status-inactive'
              : 'status-unknown'
          }`}>
            {(statusValue)? 'Active' : 'Inactive'}
          </span>
        );
      
      case 'date':
        return formatDate(value);
      
      case 'actions':
        return (
          <div className="action-buttons">
            <button
              onClick={() => onView(item)}
              className="action-btn action-btn-view"
              title="View"
            >
              <Eye size={20} />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="action-btn action-btn-edit"
              title="Edit"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => handleDeleteClick(item)}
              className="action-btn action-btn-delete"
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
          </div>
        );
      
      default:
        return value || 'N/A';
    }
  };

  const generatePaginationNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="common-table-container">
      {/* Header */}
      <div className="table-header">
        <div className="header-flex">
          <h1 className="header-title">{title}</h1>
          <nav className="breadcrumb">
            <span>Home</span>
            <ChevronRight size={16} />
            <span className="breadcrumb-current">{title}</span>
          </nav>
        </div>
      </div>

      {/* Business List Header */}
      <div className="table-content">
        <div className="business-header">
          {SubText && (<h2 className="business-title">{SubText}</h2>)}
          
          {addButtonLink && addButtonLink !== '#' && (
            <a
              href={addButtonLink}
              className="add-button"
            >
              <Plus size={18} />
              <span>{addButtonText}</span>
            </a>
          )}
        </div>
        
        {/* Search and Filter Bar */}
        {/* <div className="search-filter-container">
          <div className="search-controls">
            {searchable && (
              <div className="search-group">
                <div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="search-input"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="search-button"
                >
                  Search
                </button>
              </div>
            )}
            
            {filterable && filterOptions.length > 0 && (
              <div className="filter-container">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="filter-button"
                >
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
                
                {showFilterDropdown && (
                  <div className="filter-dropdown">
                    <div>
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterSelect(option.value)}
                          className="filter-dropdown-item"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="table-actions">
            <button className="action-menu-button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div> */}

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead className="table-header-row">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="table-header-cell"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="loading-container">
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : safeData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="empty-state">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                safeData.map((item, index) => (
                  <tr key={item.id || index} className="table-row">
                    {columns.map((column) => (
                      <td key={column.key} className="table-cell">
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalCount)} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of{' '}
              {pagination.totalCount} entries
            </div>
            
            <div className="pagination-controls">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              {generatePaginationNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`pagination-btn pagination-btn-page ${
                    pageNum === pagination.currentPage ? 'active' : ''
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonTable;