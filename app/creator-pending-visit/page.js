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
import { useTranslation } from "react-i18next";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { TextField, Button } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useRouter } from 'next/navigation';

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
  const [isAcceptVisit, setIsAcceptVisit] = useState(false);
  const [isRescheduleVisit, setIsRescheduleVisit] = useState(false);
  const [deletePropertyid, setDeletePropertyid] = useState('');
  const [isVisitUserId, setIsVisitUserId] = useState(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: variablesList.currentPage,
    itemsPerPage: variablesList.itemsPerPage,
  });
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { t, i18n } = useTranslation();
  const [isTab, setIsTab] = useState(1);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const router = useRouter();
  useEffect(() => {
    // const requestData = {
    // 		propertyId: data.id,
    // 		dateAndTime: formattedDateTime,
    // 		visitType: isTab === 1 ? "Physical" : "Virtual",
    // 		property_publisher_id: data.user_id
    // 	};
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


      const getUserInfo = await insertData('api/visit/get-pending-visit-schedule-creators', requestData, true); // Ensure data is passed
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

  const rescheduleVisitRequest = () => {
    setIsAcceptVisit(false);
    setIsRescheduleVisit(true)
  }

  const acceptVisitRequest = async () => {
    const id = isVisitUserId;
    try {
      const requestData = {
        visitId: id,
      };
      const response = await insertData('api/visit/reject-pending-Visit', requestData, true); // Ensure data is passed
      if (response.status) {
        fetchData(); // Refresh data
        setIsAcceptVisit(false);
      } else {
        console.log(3)
        setError(response.data.message || 'An error occurred'); // Handle error
      }
    } catch (err) {
      console.log(4)
      setError(err.response?.message || 'An error occurred'); // Handle error
    }
  }
  const acceptVisit = async (id) => {
    try {
      const requestData = {
        visitId: id,
      };
      console.log('Here');
      const response = await insertData('api/visit/accept-pending-Visit', requestData, true); // Ensure data is passed
      console.log('response', response);
      if (response.status) {
        fetchData();// Refresh data
        setIsAcceptVisit(false);
      } else {
        console.log(1)
        setError(response.data.message || 'An error occurred'); // Handle error
      }
    } catch (err) {
      console.log(2)
      setError(err.response?.message || 'An error occurred'); // Handle error
    }
  };
  const rejectVisit = async (id) => {
    try {
      const requestData = {
        visitId: id,
      };
      const response = await insertData('api/visit/get-visit-user-detail', requestData, true); // Ensure data is passed
      if (response.status) {
        setSelectedDateTime(dayjs(response.data.scheduled_date));
      } else {
        console.log(response.data.message || 'An error occurred'); // Handle error
      }
    } catch (err) {
      console.log(err.response?.message || 'An error occurred'); // Handle error
    }
    setIsAcceptVisit(true);
    setIsVisitUserId(id);
    //   const requestData = {
    //     visitId: id,
    //   };
    //   const response = await insertData('api/visit/reject-pending-Visit', requestData, true); // Ensure data is passed
    //   if (response.status) {
    //     fetchData(); // Refresh data
    //   } else {
    //     setError(response.data.message || 'An error occurred'); // Handle error
    //   }
    // } catch (err) {
    //   setError(err.response?.message || 'An error occurred'); // Handle error
    // }
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
              hour12: true
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
      saveAs(new Blob([buffer]), "property_visit_pending.xlsx");

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
          hour12: true
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

    doc.save("property_visit_pending.pdf");
  };

  const handleTab = (i) => {
    setIsTab(i);
  };

  const visitSchedule = async () => {
    if (!selectedDateTime) return;

    setLoading(true);
    try {
      const formattedDateTime = dayjs(selectedDateTime).toISOString();

      const requestData = {
        id: isVisitUserId,
        dateAndTime: formattedDateTime,
        visitType: isTab === 1 ? "Physical" : "Virtual",
      };

      const response = await insertData("api/visit/visit-update-schedule", requestData, true);
      if (response.status) {
        // // console.log(response.data);
        fetchData();
        setIsRescheduleVisit(false);
        setError(null);
        router.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Please log in after creating the visit.");
    } finally {
      setLoading(false);
    }
  }

  const closeModal = () => {
    // // console.log("Closing Modal"); // Debugging
    setIsRescheduleVisit(false);
    setIsAcceptVisit(false);
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
                <div className="top d-flex align-items-center" style={{ marginBottom: "20px" }}>
                  <div className="tf-btn secondary" style={{ marginRight: "20px" }} onClick={() => router.push('/visit-schedule')}>
                    Scheduled Visits
                  </div>
                  <div>
                    <button className="tf-btn primary" style={{ marginRight: "20px" }}>Pending Visits</button>
                  </div>
                  <div className="tf-btn secondary" onClick={() => router.push('/creator-rejected-visit')}>
                    Rejected Visits
                  </div>
                </div>
                <div className="top d-flex justify-content-between align-items-center">
                  <h6 className="title">Property Pending visit Scheduled Listing</h6>
                  <div style={{ display: "flex", alignItems: "center" }}>
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
                              <th>Status</th>
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
                                  hour12: true
                                })}</td>
                                <td>{user.visit_type}</td>
                                <td style={{ paddingLeft: "20px" }}>
                                  <div className="status-wrap" style={{ display: "flex", justifyContent: "space-between", width: "130px" }}>
                                    <div
                                      className="btn-status custom-link"
                                      style={{ backgroundColor: "green" }}
                                      onClick={() => acceptVisit(user.id)}
                                    >
                                      Accept
                                    </div>

                                    <div
                                      className="btn-status custom-link"
                                      style={{ backgroundColor: "red"}}
                                      onClick={() => rejectVisit(user.id)}
                                    >
                                      Reject
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
                            <div
                            className={`nav-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)} href="#"
                            style={{ cursor: 'pointer' }}
                          >
                            {index + 1}
                          </div>
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
                              <th>Image</th>
                              <th>Name</th>
                              <th>Email Address / Phone Number</th>
                              <th>Date Published</th>
                              <th>Status</th>
                              <th>Action</th>
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
          {isAcceptVisit && (
            <div className="modal" style={{ display: 'block', position: 'fixed', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-content-alert login-alert-sec" >
                <div className="close-modal icon-close2 contact-close-popup" onClick={closeModal}></div>
                <>
                  <div>
                    <span>Reject the visit request :
                      {/* <strong  style={{ marginTop: "10px", fontWeight: "bold"  }}>{dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm")}</strong> */}
                    </span><br />
                    <button className="tf-btn primary" style={{ marginTop: "10px" }} onClick={() => acceptVisitRequest()}>Rejected</button>
                  </div>
                  <hr />
                  <div>
                    <span>Reschedule the visit request:</span>
                    <button className="tf-btn primary" style={{ marginTop: "10px" }} onClick={() => rescheduleVisitRequest()}>Reschedule</button>
                  </div>
                </>
              </div>
            </div>
          )}
          {isRescheduleVisit && (
            <div className="custom-modal">
              <div className="custom-modal-content">
                <>
                  <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>{t("visitSchedule")}</div>
                  <section className="wrapper-layout-3">
                    <div style={{ width: "100%", backgroundColor: "#f7f7f7", padding: "20px" }}>
                      <div className="flat-tab flat-tab-form widget-filter-search">
                        <ul className="nav-tab-form" role="tablist">
                          <li className="nav-tab-item" onClick={() => handleTab(1)}>
                            <a className={isTab === 1 ? "nav-link-item active" : "nav-link-item"}>{t("Physical")}</a>
                          </li>
                          <li className="nav-tab-item" onClick={() => handleTab(2)}>
                            <a className={isTab === 2 ? "nav-link-item active" : "nav-link-item"}>{t("Virtual")}</a>
                          </li>
                        </ul>
                      </div>

                      {/* DateTime Picker */}
                      {console.log(selectedDateTime, ">>>>>>>>>>>>>>> selectedDateTime")}
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
                          {loading ? "Scheduling..." : t("confirm")}
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
      )}
    </>
  );
}
