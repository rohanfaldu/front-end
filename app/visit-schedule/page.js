'use client';

import DeleteFile from "@/components/elements/DeleteFile";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import Link from "next/link";
import Image from 'next/image';
import { insertData, deletedData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import React, { useEffect, useState } from 'react';
import EditIcon from "../../public/images/favicon/edit.png";
import DeleteIcon from "../../public/images/favicon/delete.png";
import ViewIcon from "../../public/images/favicon/view.png";
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
export default function MyProperty() {
  const [propertiesVisits, setPropertiesVisits] = useState([]); // Store all fetched properties
  const [filteredProperties, setFilteredProperties] = useState([]); // Store filtered properties
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state
  const [searchTerm, setSearchTerm] = useState(''); // Store search input
  const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 5; // Number of items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePropertyid, setDeletePropertyid] = useState('');
  const [isTab, setIsTab] = useState(1);
  const [clickedId, setClickedId] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: variablesList.currentPage,
    itemsPerPage: variablesList.itemsPerPage,
  });
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  // const { t } = useTranslation();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { t, i18n } = useTranslation();


  useEffect(() => {


    fetchData(); // Fetch data on component mount
  }, []);

  const formattedStartDate = startDate ? `${startDate}T00:00:00.000Z` : null;
  const formattedEndDate = endDate ? `${endDate}T23:59:59.999Z` : null;

  const fetchData = async (page = 1) => {
    try {
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      const getUserInfo = await insertData('api/visit/get-accepted-visit-schedule', requestData, true); // Ensure data is passed
      setPropertiesVisits(getUserInfo.data.list); // Save all properties
      const { totalCount, totalPages, currentPage } = response.data;
      setPagination({
        ...pagination,
        totalCount,
        totalPages,
        currentPage,
      });
      setLoading(false); // Stop loading
      setError(null); // Clear errors
    } catch (err) {
      setError(err.response?.message || 'An error occurred'); // Handle error
      setLoading(false); // Stop loading
    }
  };

  const visitSchedule = async () => {
    if (!selectedDateTime) return;

    setLoading(true);
    try {
      const formattedDateTime = dayjs(selectedDateTime).toISOString();
      // console.log('formattedDateTime: ', formattedDateTime);

      const requestData = {
        visitId: clickedId,
        dateAndTime: formattedDateTime,
        visitType: isTab === 1 ? "Physical" : "Virtual",
      };

      const response = await insertData("api/visit/visit-reschedule", requestData, true);
      if (response.status) {
        // console.log(response.data);
        setIsModalOpen(false);
        setError(null);
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };


  const openModal = (id) => {
    // console.log("Opening Modal"); // Debugging
    setIsModalOpen(true);
    setClickedId(id);
  };

  const closeModal = () => {
    // console.log("Closing Modal"); // Debugging
    setIsModalOpen(false);
  };

  const handleTab = (i) => {
    setIsTab(i);
  };

  const exportToExcel = async () => {
    try {
      // console.log("Exporting to Excel...");

      if (!propertiesVisits || propertiesVisits.length === 0) {
        alert("No data to export");
        return;
      }

      // Ensure properties data exists
      // console.log("Properties:", propertiesVisits);

      // Create a new workbook instance
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Property Comments");

      // Define columns
      worksheet.columns = [
        { header: "Title", key: "title", width: 50 },
        { header: "Visitor Email / Phone", key: "visitor_email_phone", width: 20 },
        { header: "Visitor Name", key: "visitor_name", width: 20 },
        { header: "Visit Date", key: "visit_date", width: 20 },
        { header: "Visit Type", key: "visit_type", width: 20 },
      ];

      // Apply bold font to the header row
      worksheet.getRow(1).font = { bold: true };

      // Add data to worksheet
      propertiesVisits.forEach((p) => {
        worksheet.addRow({
          title: p?.property.lang_translations.en_string || "N/A",
          visitor_email_phone: `${p?.users.email_address || "N/A"} / ${p?.users.mobile_number || "N/A"}`,
          visitor_name: p?.users.full_name || "N/A",
          visit_date: p?.scheduled_date
            ? new Date(p.scheduled_date).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })
            : "N/A",
          visit_type: p?.visit_type || "N/A"
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
      saveAs(new Blob([buffer]), "property_visit_accepted.xlsx");

      // console.log("Excel file exported successfully!");
    } catch (error) {
      console.error("Excel export error:", error);
      alert("Error exporting to Excel: " + error.message);
    }
  };


  const exportToPDF = () => {
    if (propertiesVisits.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();

    // Table data
    const tableBody = propertiesVisits.map((property) => [
      property?.property?.lang_translations?.en_string || "N/A",
      [property?.users?.email_address, property?.users?.mobile_number]
        .filter(Boolean)
        .join(" / ") || "N/A",
      property?.users?.full_name || "N/A",
      property?.scheduled_date
        ? new Date(property.scheduled_date).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
        : "N/A",
      property?.visit_type || "N/A",
    ]);

    // Generate table
    autoTable(doc, {
      head: [["Title", "Visitor Email / Phone", "Visitor Name", "Visit Date", "Visit Type"]],
      body: tableBody,
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        4: { cellWidth: 30 },
        4: { cellWidth: 30 },
      },
      styles: { fontSize: 10, cellPadding: 5 },
      didDrawCell: (data) => {
        if (data.column.index === 3 && propertiesVisits[data.row.index]?.users?.image) {
          const imgUrl = propertiesVisits[data.row.index].users.image;
          const x = data.cell.x + 5;
          const y = data.cell.y + 3;
          const width = 20;
          const height = 20;
          doc.addImage(imgUrl, "JPEG", x, y, width, height);
        }
      },
    });

    doc.save("property_visit_accepted.pdf");
  };

  const handleClickToWhatsApp = (code, mobile_number) => {
    
    if (mobile_number) {
      const whatsappUrl = `https://wa.me/${code.replace(/\D/g, '')}${mobile_number.replace(/\D/g, '')}`;
      window.open(whatsappUrl, "_blank");
    } 
  }
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

                <div className="top d-flex align-items-center" style={{ marginBottom: "20px" }}>
                  <div>
                    <button className="tf-btn primary" style={{ marginRight: "20px" }}>Scheduled Visits</button>
                  </div>
                  <Link href="/creator-pending-visit">
                    <button className="tf-btn secondary" style={{ marginRight: "20px" }}>Pending Visits</button>
                  </Link>
                  <Link href="/creator-rejected-visit">
                    <button className="tf-btn secondary">Rejected Visits</button>
                  </Link>
                </div>
                <div className="top d-flex justify-content-between align-items-center">
                  <h6 className="title">Property visit Scheduled Listing</h6>
                  {/* <Link className="remove-file tf-btn primary" href="/create-agency">Add Agnecy</Link> */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* <div>
                      <Link className="remove-file tf-btn primary" href="/create-agency" style={{marginRight: "20px"}}>Add Agency</Link>
                    </div> */}
                    <div>
                      <button onClick={exportToExcel} className="tf-btn primary" style={{ marginRight: "20px" }}>Export Excel</button>
                      <button onClick={exportToPDF} className="tf-btn secondary" style={{ marginRight: "20px" }}>Export PDF</button>

                    </div>
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
                      onClick={() => fetchData()}
                      className="tf-btn primary"
                      style={{ width: "100%" }}
                    >
                      Filter Date Range
                    </button>
                  </div>
                </div>
                {console.log(propertiesVisits, '>>>>>>>>>>>> user')}
                {(propertiesVisits.length > 0) ?
                  <>
                    <div className="wrap-table">
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Property Title</th>
                              <th>Visitor Name</th>
                              <th>Visitor Email / Phone</th>
                              <th>Visit Date</th>
                              <th>Visit Type</th>
                              <th>Visit Rescheduler</th>
                            </tr>
                          </thead>
                          <tbody>
                            {propertiesVisits.map(user => (
                              <tr key={user.id} className="file-delete">
                                <td>{user.property.lang_translations.en_string}</td>
                                <td>{user.users.full_name}</td>
                                <td>
                                  <span>{user.users.email_address} <br />{user.users.mobile_number}</span>
                                </td>
                                <td>{new Date(user.scheduled_date).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                  hour12: false
                                })}</td>
                                <td>
                                  {user.visit_type === "Virtual" ? (
                                    <div
                                    onClick={() => handleClickToWhatsApp(user.property.users.country_code, user.property.users.mobile_number)}
                                    >
                                      <div className="status-wrap" style={{ cursor: "pointer" }}>
                                        <span>{user.visit_type}</span>
                                        <img
                                          src="/images/icons/whatsapp.png"
                                          alt="WhatsApp"
                                          width={30}
                                          height={30}
                                          className="visit-icon-whatsapp"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    user.visit_type
                                  )}
                                </td>
                                <td onClick={() => openModal(user.id)}>
                                  <div className="status-wrap">
                                    <div href="#" className="btn-status" style={{ backgroundColor: "#00a8c1", cursor: "pointer" }} >
                                      Reschedule
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <ul className="wd-navigation">
                        {[...Array(Math.ceil(propertiesVisits.length / itemsPerPage))].map((_, index) => (
                          <li key={index}>
                            <Link
                              href="#"
                              className={`nav-item ${currentPage === index + 1 ? 'active' : ''}`}
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </Link>
                          </li>
                        ))}
                      </ul>

                    </div>
                  </> : <>
                    <div className="wrap-table">
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Property Title</th>
                              <th>Visitor Name</th>
                              <th>Visitor Email / Phone</th>
                              <th>Visit Date</th>
                              <th>Visit Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>No Record Found</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                }
              </div>
            </div>
          </LayoutAdmin>


        </>
      )}
      {isModalOpen && (
        <div className="custom-modal">
          <div className="custom-modal-content 12">
            <>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>{t("visitSchedule")}</div>
              <section className="wrapper-layout-3">
                <div style={{ width: "100%", backgroundColor: "#f7f7f7", padding: "20px" }}>
                  <div className="flat-tab flat-tab-form widget-filter-search">
                    <ul className="nav-tab-form" role="tablist">
                      <li className="nav-tab-item" onClick={() => handleTab(1)}>
                        <a className={isTab === 1 ? "nav-link-item active" : "nav-link-item"}>{t("physical")}</a>
                      </li>
                      <li className="nav-tab-item" onClick={() => handleTab(2)}>
                        <a className={isTab === 2 ? "nav-link-item active" : "nav-link-item"}>{t("virtual")}</a>
                      </li>
                    </ul>
                  </div>

                  {/* DateTime Picker */}
                  <div style={{ marginTop: "20px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Select Date & Time"
                        value={selectedDateTime}
                        ampm={false}
                        onChange={(newValue) => setSelectedDateTime(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </div>

                  {/* Display Selected Date & Time */}
                  {selectedDateTime && (
                    <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                      Selected Date & Time: {dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm")}
                    </div>
                  )}

                  {/* Buttons */}
                  <div style={{ marginTop: "20px" }}>
                    <button className="tf-btn primary" disabled={!selectedDateTime || loading} onClick={visitSchedule}>
                      {loading ? "Scheduling..." : "Confirm"}
                    </button>
                    <button className="tf-btn primary" onClick={closeModal}>
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              </section>


            </>

          </div>
        </div>
      )}
    </>
  );
}
