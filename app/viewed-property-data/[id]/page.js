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

export default function PropertyViewedListing({ params }) {
  const { id } = params;
  const [properties, setProperties] = useState([]); // Store properties for the current page
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [pagination, setPagination] = useState({
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10,
  }); // Track pagination info


  const formattedStartDate = startDate ? `${startDate}T00:00:00.000Z` : null;
  const formattedEndDate = endDate ? `${endDate}T23:59:59.999Z` : null;

  const fetchProperties = async (page = 1, id) => {
    setLoading(true);
    try {
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        propertyId : id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      const response = await insertData("api/property/get-viewed-property-user", requestData, true);
      if (response.status) {
        const { list, totalCount, totalPages, currentPage } = response.data;
        console.log('response.data: ', response.data);
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
    fetchProperties(pagination.currentPage, id);
  }, [pagination.currentPage, id]);

  
  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
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
            { header: "Name", key: "name", width: 20 },
            { header: "Email", key: "email", width: 25 },
            { header: "Mobile", key: "mobile", width: 15 },
            { header: "Image", key: "image", width: 100 },
            { header: "View_count", key: "view_count", width: 15 },
          ];
      
          // Apply bold font to the header row
          worksheet.getRow(1).font = { bold: true };
      
          // Add data to worksheet
          properties.forEach((p) => {
            worksheet.addRow({
              name: p?.users?.full_name || "N/A",
              email: p?.users?.email_address || "N/A",
              mobile: p?.users?.mobile_number || "N/A",
              image: p?.users?.image || "N/A",
              view_count: p?.view_count || "N/A",
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
          property?.users?.full_name || "N/A",
          property?.users?.email_address || "N/A",
          property?.users?.mobile_number || "N/A",
          property?.users?.image || "N/A",
          property?.view_count || "N/A",
        ]);
        
        // Generate table first
        autoTable(doc, {
          head: [["Name", "Email", "Mobile", "Image", "View_count"]],
          body: tableBody,
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 50 },
            2: { cellWidth: 30 },
            3: { cellWidth: 40 },
            4: { cellWidth: 40 },
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
          // This callback runs after each page is added
          // didDrawPage: (data) => {
          //   // Add watermark to each page
          //   const pageWidth = doc.internal.pageSize.getWidth();
          //   const pageHeight = doc.internal.pageSize.getHeight();
          //   doc.setTextColor(200, 200, 200); // Light gray
          //   doc.setFontSize(50);
          //   doc.text("Immofind", pageWidth / 2, pageHeight / 2, { 
          //     align: "center", 
          //     angle: 45, 
          //     opacity: 0.2 
          //   });
          // }
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
                  <h6 className="title">Selected Property View Engagements</h6>
                  {/* <Link className="remove-file tf-btn primary" href="/create-property">Add Property</Link> */}
                  <div>
                    <button onClick={exportToExcel} className="tf-btn primary" style={{marginRight: "20px"}}>Export Excel</button>
                    <button onClick={exportToPDF} className="tf-btn secondary">Export PDF</button>
                  </div>
                </div>

                <div className="top d-flex justify-content-between align-items-center mt-3">

                <div style={{ display: "flex", flexDirection: "column", flex: 1, marginRight: "40px" }}>
                  <label htmlFor="start-date" style={{ marginBottom: "5px", fontWeight: "bold" }}>Start Date</label>
                  <input
                    type="date"
                    id="start-date"
                    ref={startDateRef}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onClick={() => startDateRef.current.showPicker()}
                    style={{ padding: "5px", cursor: "pointer", width: "100%" }}
                  />
                </div>

                {/* End Date */}
                <div style={{ display: "flex", flexDirection: "column", flex: 1, marginRight: "40px" }}>
                  <label htmlFor="end-date" style={{ marginBottom: "5px", fontWeight: "bold" }}>End Date</label>
                  <input
                    type="date"
                    id="end-date"
                    ref={endDateRef}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onClick={() => endDateRef.current.showPicker()}
                    style={{ padding: "5px", cursor: "pointer", width: "100%" }}
                  />
                </div>

                {/* Button */}
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <label style={{ visibility: "hidden", marginBottom: "5px" }}>Filter</label>
                  <button 
                    onClick={() => fetchProperties(1, id)} 
                    className="tf-btn primary" 
                    style={{ width: "100%" }}
                  >
                    Filter Date Range
                  </button>
                </div>
              </div>
                {properties?.length > 0 ? (
                  <>
                    <div className="wrap-table">
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Email Address</th>
                              <th>Mobile Number</th>
                              <th>Date</th>
                              {/* <th>Action</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {properties.map((property) => (
                              <tr key={property.id}>
                                <td>
                                  <div className="listing-box">
                                    <div className="images">
                                      <img
                                        src={property?.users?.image || '/images/avatar/user-image.png'}
                                        alt="Property"
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>{property?.users?.full_name}</td>
                                <td>
                                  {property?.users?.email_address}
                                </td>
                                <td>{property?.users?.mobile_number}</td>
                                <td>{new Date(property?.created_at).toLocaleDateString()}</td>
                                {/* <td>
                                  <ul className="list-action">
                                  </ul>
                                </td> */}
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
