
'use client'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { use, useState, useEffect } from "react"
import CountetNumber from "@/components/elements/CountetNumber"
import DashboardChart from "@/components/elements/DashboardChart"
import DeleteFile from "@/components/elements/DeleteFile"
import LayoutAdmin from "@/components/layout/LayoutAdmin"
import Link from "next/link";
import { insertData, deletedData } from "../../components/api/Axios/Helper";
import Preloader from "@/components/elements/Preloader";
import ViewIcon from "../../public/images/favicon/view.png";
export default function LikedProperty() {
	const [properties, setProperties] = useState([]); // Store properties for the current page
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state
  const [searchTerm, setSearchTerm] = useState(''); // Store search input
  const [statusFilter, setStatusFilter] = useState(''); // Store selected status filter
  const [pagination, setPagination] = useState({
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 5,
  }); // Track pagination info
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const fetchProperties = async (page = variablesList.currentPage, term = '', status = '') => {
    setLoading(true);
    try {
      const requestData = {
        page,
        limit: pagination.itemsPerPage,
        lang: "en",
        title: "",
        description: "",
      };

      const response = await insertData("api/property/get-liked-property", requestData, true);
      // console.log(response);
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


  const unLike = async (id) => {

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/api/property/${id}/like`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.status) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                return;
            }else{
                fetchProperties(pagination.currentPage, searchTerm, statusFilter);
            }
        } catch (error) {
            console.error('Error liking the property:', error);
        }
};

  const handleView = (id) => {
    const URL = `${process.env.NEXT_PUBLIC_SITE_URL}/property/${id}`;
      window.open(URL, '_blank')
  };

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
                    <div className="top d-flex justify-content-between align-items-center">
                      <h6 className="title">Liked Property</h6>
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
                                  <th>Price</th>
                                  <th>Date Published</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {properties.map((property) => (
                                  <tr key={property.property.id}>
                                    <td>
                                      <div className="listing-box">
                                        <div className="images">
                                          <img
                                            src={property.property.picture[0] || '/images/avatar/user-image.png'}
                                            alt="Property"
                                          />
                                        </div>
                                      </div>
                                    </td>
                                    <td>{property.property.title}</td>
                                    <td>
                                      {property.property.price} {property.property.currency ?? "USD"}
                                      {/* <br />
                                      {property.property.user_name} */}
                                    </td>
                                    <td>{new Date(property.property.created_at).toLocaleDateString()}</td>
                                    <td>
                                      <ul className="list-action">
                                        <li className="delete">
                                          <a
                                            className="remove-file item"
                                            onClick={() => handleView(property.property.slug)}
                                            style={{ border: 'none', background: 'transparent', padding: 0 }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <img
                                              src="/images/favicon/view.png"
                                              alt="View icon"
                                              width={25}
                                              height={25}
                                            />
                                          </a>
                                        </li>

                                        <li className="delete">
                                            <a
                                                className="remove-file item"
                                                onClick={() => unLike(property.property.id)}
                                            >
                                                <img
                                                src="/images/logo/heart.png"
                                                alt="Delete icon"
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