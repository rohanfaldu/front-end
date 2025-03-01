'use client';

import DeleteFile from "@/components/elements/DeleteFile";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import Link from "next/link";
import { insertData } from "@/components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useRef } from "react"; 
export default function PropertyViewedListing({ params }) {
  const { id } = params;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
  });

  const formattedStartDate = startDate ? `${startDate}T00:00:00.000Z` : null;
  const formattedEndDate = endDate ? `${endDate}T23:59:59.999Z` : null;

  const fetchProperties = async (page = 1, id) => {
    setLoading(true);
    try {
      
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        propertyId: id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      const response = await insertData("api/property/get-commented-property-user", requestData, true);
      if (response.status) {
        const { list, totalCount, totalPages, currentPage } = response.data;
        setProperties(list);
        setPagination({ ...pagination, totalCount, totalPages, currentPage });
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
        { header: "Comment", key: "comment", width: 30 },
        { header: "Rating", key: "rating", width: 10 },
      ];
  
      // Apply bold font to the header row
      worksheet.getRow(1).font = { bold: true };
  
      // Add data to worksheet
      properties.forEach((p) => {
        worksheet.addRow({
          name: p?.users?.full_name || "N/A",
          email: p?.users?.email_address || "N/A",
          mobile: p?.users?.mobile_number || "N/A",
          comment: p?.comment || "N/A",
          rating: p?.rating?.toString() || "N/A",
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
      saveAs(new Blob([buffer]), "property_comment_engagements.xlsx");
  
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
  
    // Add Watermark (Faded Text)
    // const pageWidth = doc.internal.pageSize.getWidth();
    // const pageHeight = doc.internal.pageSize.getHeight();
  
    // // Apply watermark in the center
    // doc.setTextColor(200, 200, 200); // Light gray color
    // doc.setFontSize(50);
    // doc.text("Immofind", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
  
    autoTable(doc, {
      head: [["Name", "Email", "Mobile", "Comment", "Rating"]],
      body: properties.map((property) => [
        property?.users?.full_name || "N/A",
        property?.users?.email_address || "N/A",
        property?.users?.mobile_number || "N/A",
        property?.comment || "N/A",
        property?.rating || "N/A",
      ]),
    });
  
    doc.save("property_comment_engagements.pdf");
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
                <div className="top d-flex justify-content-between align-items-center">
                  <h6 className="title">Selected Property Comment Engagements</h6>
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
                  <div className="wrap-table">
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Comment</th>
                            <th>Rating</th>
                            <th>Date Published</th>
                          </tr>
                        </thead>
                        <tbody>
                          {properties.map((property) => (
                            <tr key={property.id}>
                              <td>{property?.users?.full_name}</td>
                              <td>{property?.users?.email_address}</td>
                              <td>{property?.users?.mobile_number}</td>
                              <td>{property?.comment}</td>
                              <td>{property?.rating}</td>
                              <td>{new Date(property?.created_at).toLocaleDateString()}</td>
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
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(index + 1);
                            }}
                          >
                            {index + 1}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
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