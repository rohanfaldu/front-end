'use client';

import DeleteFile from "@/components/elements/DeleteFile";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import Link from "next/link";
import { insertData, deletedData } from "@/components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import EditIcon from "@/public/images/favicon/edit.png";
import DeleteIcon from "@/public/images/favicon/delete.png";
//import variablesList from "@/components/common/Variable";
import ViewIcon from "@/public/images/favicon/view.png";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useRef } from "react";
import variablesList from "@/components/common/Variable";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { TextField } from "@mui/material";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useTranslation } from "react-i18next";

dayjs.extend(utc);
dayjs.extend(timezone);
export default function PropertyListing() {
  const [properties, setProperties] = useState([]); // Store properties for the current page
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state
  const [searchTerm, setSearchTerm] = useState(''); // Store search input
  const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
  const [pagination, setPagination] = useState({
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 100,
  }); // Track pagination info
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePropertyid, setDeletePropertyid] = useState('');
  const fetchProperties = async (page = 1, term = '', status = '') => {
    setLoading(true);
    try {
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        lang: "en",
        searchTerm: term,
        status,
        flag: 'view'

      };

      const response = await insertData("api/property/agent-developer", requestData, true);
      if (response.status) {
        const { list, totalCount, totalPages, currentPage } = response.data;
        setProperties(list);
        setPagination({
          ...pagination,
          totalCount,
          totalPages,
          currentPage,
        });
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(pagination.currentPage, searchTerm, statusFilter);
  }, [pagination.currentPage, searchTerm, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination({ ...pagination, currentPage: 1 }); // Reset to first page on search
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination({ ...pagination, currentPage: 1 }); // Reset to first page on filter
  };

  const handleDelete = async () => {
    try {
      const response = await deletedData(`api/property/${deletePropertyid}`, { propertyId: deletePropertyid });
      if (response.status) {
        fetchProperties(pagination.currentPage, searchTerm, statusFilter);
        setIsModalOpen(false);
      } else {
        alert(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };
  
  const statusChange = async (id) => {
    try {
      const response = await insertData("api/property/statusUpdate", {id: id}, true);
      if (response.status) {
        fetchProperties(pagination.currentPage, searchTerm, statusFilter);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };
  
  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handleView = (id) => {
    const URL = `/viewed-property-data/${id}`;
      window.open(URL, '_blank')
  };

  const openModal = (id) => {
    setIsModalOpen(true);
    setDeletePropertyid(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const exportToExcel = async () => {
          try {
            console.log("Exporting to Excel...");
      
            if (!properties || properties.length === 0) {
              alert("No data to export");
              return;
            }
      
            // Ensure properties data exists
            console.log("Properties:", properties);
      
            // Create a new workbook instance
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Property Comments");
      
            // Define columns
            worksheet.columns = [
              { header: "Property Title", key: "property_title", width: 50 },
              { header: "Property Price", key: "property_price", width: 40 },
              { header: "Property View", key: "property_view", width: 40 },
            ];
      
            // Apply bold font to the header row
            worksheet.getRow(1).font = { bold: true };
      
            // Add data to worksheet
            properties.forEach((p) => {
              worksheet.addRow({
                property_title: p?.title || "N/A",
                property_price: p?.price || "N/A",
                property_view: p?.view_count || "N/A",
              });
            });
      
            // Apply border to all cells
            worksheet.eachRow((row) => {
              row.eachCell((cell) => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" },
                };
              });
            });
      
            // Write to buffer and save the file
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), "property_view_engagements.xlsx");
      
            console.log("Excel file exported successfully!");
          } catch (error) {
            console.error("Excel export error:", error);
            alert("Error exporting to Excel: " + error.message);
          }
        };
    
     const exportToPDF = () => {
        if (properties.length === 0) {
          alert("No data to export");
          return;
        }
    
        const doc = new jsPDF();
    
        // Table data
        const tableBody = properties.map((property) => [
          property?.title || "N/A",
          property?.price || "N/A",
          property?.view_count || "N/A",
        ]);
    
        // Generate table
        autoTable(doc, {
          head: [["Property Title", "Property Price", "Property View",]],
          body: tableBody,
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 40 },
            2: { cellWidth: 40 },
          },
          styles: { fontSize: 10, cellPadding: 5 },
          didDrawCell: (data) => {
            if (data.column.index === 3 && properties[data.row.index]?.users?.image) {
              const imgUrl = properties[data.row.index].users.image;
              const x = data.cell.x + 5;
              const y = data.cell.y + 3;
              const width = 20;
              const height = 20;
              doc.addImage(imgUrl, "JPEG", x, y, width, height);
            }
          },
        });
    
        doc.save("property_view_engagements.pdf");
      };

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <DeleteFile />
          <LayoutAdmin>
            <div className="wrap-dashboard-content">
              <div className="widget-box-2 wd-listing">
                <div class="top d-flex justify-content-between align-items-center">
                  <h6 className="title">Select Property to analyze View Engagements</h6>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <button onClick={exportToExcel} className="tf-btn primary" style={{ marginRight: "20px" }}>Export Excel</button>
                      <button onClick={exportToPDF} className="tf-btn secondary" style={{ marginRight: "20px" }}>Export PDF</button>
                    </div>
                  </div>
                </div>
                {properties.length > 0 ? (
                  <>
                    <div className="wrap-table">
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Title</th>
                              <th>Price / User Name</th>
                              {/* <th>Date Published</th> */}
                              <th>View</th> 
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {properties.map((property) => (
                              <tr key={property.id}>
                                <td>
                                  <div className="listing-box">
                                    <div className="images">
                                      <img
                                        src={property.picture[0] || '/images/avatar/user-image.png'}
                                        alt="Property"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>{property.title}</td>
                                <td>
                                  {property.price} {property.currency ?? "$"}
                                  <br />
                                  {property.user_name}
                                </td>
                                {/* <td>{new Date(property.created_at).toLocaleDateString()}</td> */}
                                <td>{property.view_count}</td>
                                {/* <td>
                                  <div className="status-wrap">
                                    <Link href="#" className="btn-status" onClick={() => statusChange(property.id)}>
                                      {property.status ? "Active" : "Inactive"}
                                    </Link>
                                  </div>
                                </td> */}
                                <td>
                                  <ul className="list-action">
                                    
                                  {/* <li className="edit">
                                    <Link href={`/edit-property/${property.slug}`} className="item">
                                      <Image
                                        src={EditIcon} // Imported image object or static path
                                        alt="Edit icon"
                                        width={25}
                                        height={25}
                                      />
                                    </Link>
                                  </li>
                                  <li className="delete">
                                    <a className="remove-file item"  onClick={() => openModal(property.id)}>
                                      <Image
                                          src={DeleteIcon} // Imported image object or static path
                                          alt="Delete icon"
                                          width={25}
                                          height={25}
                                        />
                                    </a>
                                  </li> */}
                                  <li className="delete">
                                    <a
                                      className="remove-file item"
                                      onClick={() => handleView(property.id)}
                                      style={{ border: 'none', background: 'transparent', padding: 0 }}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Image
                                        src={ViewIcon}
                                        alt="View icon"
                                        width={25}
                                        height={25}
                                      />
                                    </a>
                                  </li>

                                  </ul>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <ul className="wd-navigation">
                        {Array.from({ length: pagination.totalPages }, (_, index) => (
                          <li key={index}>
                            <Link
                              href="#"
                              className={`nav-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isModalOpen && (
                      <div className="custom-modal">
                      <div className="custom-modal-content">
                        <>
   
                          <h2>Delete Item</h2>
                          <p>Are you sure you want to delete this item?</p>
                          <div>
                            <button className="tf-btn primary " onClick={handleDelete}>Yes, Delete</button>
                            <button className="tf-btn primary" onClick={closeModal}>Cancel</button>
                          </div>
                        </>
                        
                      </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div>No records found</div>
                )}
              </div>
            </div>
          </LayoutAdmin>
        </>
      )}
    </>
  );
}
