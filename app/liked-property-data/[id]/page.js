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

export default function PropertyLikedListing({ params }) {
  const { id } = params;
  const [properties, setProperties] = useState([]); // Store properties for the current page
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state
  const [pagination, setPagination] = useState({
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 10,
  }); // Track pagination info

  const fetchProperties = async (page = 1, id) => {
    setLoading(true);
    try {
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        propertyId : id,
      };

      const response = await insertData("api/property/get-liked-property-user", requestData, true);
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
                  <h6 className="title">Selected Property Like Engagements</h6>
                  {/* <Link className="remove-file tf-btn primary" href="/create-property">Add Property</Link> */}
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
