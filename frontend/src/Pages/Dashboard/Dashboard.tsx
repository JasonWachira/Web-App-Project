import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('https://web-project-2-6qor.onrender.com/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          console.error("User fetch failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchApplications = async () => {
      try {
        const res = await fetch('https://web-project-2-6qor.onrender.com/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await res.json();
        
        if (userData.success) {
          const role = userData.data.role;
          
          // Only fetch student applications if user is a student
          if (role === 'student') {
            const appRes = await fetch('https://web-project-2-6qor.onrender.com/api/applications/my-applications', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const appData = await appRes.json();
            if (appData.success) {
              setApplications(appData.data || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (token) {
      Promise.all([fetchUserData(), fetchApplications()]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard">
      <div className="profile-section">
        <h1>Welcome, {user?.firstName}!</h1>
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        {(user?.role === 'provider' || user?.role === 'admin') && (
          <div className="provider-actions">
            <a className="add-scholarship-link" href="/add-scholarship">Add Scholarship</a>
            <Link to="/provider/applications" className="add-scholarship-link">Manage Applications</Link>
          </div>
        )}
      </div>

      <div className="applications-section">
        <h2>{user?.role === 'student' ? 'Your Scholarship Applications' : 'Dashboard'}</h2>
        {user?.role === 'student' ? (
          <>
            {!applications || applications.length === 0 ? (
              <p>No applications yet.</p>
            ) : (
              <ul>
                {applications.map((app) => (
                  <li key={app._id}>
                    
                    <strong>{app.scholarship?.title}</strong> — Status: {app.status}
                    
                    {app.scholarship?.amount && <span> (Amount: ${app.scholarship.amount})</span>}
                    {app.submittedAt && <span> | Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p>Welcome to your provider dashboard! Click "Manage Applications" above to review scholarship applications.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;