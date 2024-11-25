import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    pendingEntries: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/dashboard-data"
        ); // Direct URL here
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="dashboard-metrics">
        <div>
          <Link to="/admin/prerequisites">
            <h3>Enable Prerequisites</h3>
          </Link>
          <p>{dashboardData.totalStudents}</p>
        </div>
        <div>
          <h3>Pending Advising Entries</h3>
          <p>{dashboardData.pendingEntries}</p>
        </div>
        <div>
          <h3>Total Courses</h3>
          <p>{dashboardData.totalCourses}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
