import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderApplications.css';

function ProviderApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || (user.role !== 'provider' && user.role !== 'admin')) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    setIsAuthorized(true);
    fetchApplications(token);
  }, []);

  const fetchApplications = async (token: string) => {
    try {
      const response = await fetch(
        'https://web-project-2-6qor.onrender.com/api/applications/provider/all-applications',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        setApplications(result.data || []);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch applications' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `https://web-project-2-6qor.onrender.com/api/applications/${applicationId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (response.ok) {
        setApplications(prev =>
          prev.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        setMessage({ type: 'success', text: `Application ${newStatus} successfully!` });
      } else {
        setMessage({ type: 'error', text: 'Failed to update application status' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const filteredApplications = selectedStatus === 'all'
    ? applications
    : applications.filter(app => app.status === selectedStatus);

  if (!isAuthorized) {
    return (
      <div className="provider-applications-container">
        <h1>Access Denied</h1>
        <p>Only scholarship providers can access this page. Please log in with a provider account.</p>
        <button onClick={() => navigate('/auth')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="provider-applications-container">
      <div className="applications-header">
        <h1>Scholarship Applications</h1>
        <p>Review and manage applications for your scholarships</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="no-applications">
          <p>No applications yet. Once students apply for your scholarships, they will appear here.</p>
        </div>
      ) : (
        <>
          <div className="filter-tabs">
            <button
              className={`tab ${selectedStatus === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('all')}
            >
              All ({applications.length})
            </button>
            <button
              className={`tab ${selectedStatus === 'submitted' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('submitted')}
            >
              Submitted ({applications.filter(a => a.status === 'submitted').length})
            </button>
            <button
              className={`tab ${selectedStatus === 'approved' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('approved')}
            >
              Approved ({applications.filter(a => a.status === 'approved').length})
            </button>
            <button
              className={`tab ${selectedStatus === 'rejected' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('rejected')}
            >
              Rejected ({applications.filter(a => a.status === 'rejected').length})
            </button>
          </div>

          <div className="applications-list">
            {filteredApplications.map((application) => (
              <div className="application-card" key={application._id}>
                <div className="application-header">
                  <div className="applicant-info">
                    <h3>{application.student?.firstName} {application.student?.lastName}</h3>
                    <p className="email">📧 {application.student?.email}</p>
                    <p className="scholarship">📚 {application.scholarship?.title}</p>
                  </div>
                  <div className="status-badge" data-status={application.status}>
                    {application.status.toUpperCase()}
                  </div>
                </div>

                <div className="application-details">
                  <div className="detail-section">
                    <h4>Application Details</h4>
                    <p><strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
                    {application.gpa && <p><strong>GPA:</strong> {application.gpa}</p>}
                    {application.essay && (
                      <div className="essay-section">
                        <strong>Essay:</strong>
                        <p className="essay-text">{application.essay}</p>
                      </div>
                    )}
                  </div>

                  {application.student?.studentProfile && (
                    <div className="detail-section">
                      <h4>Student Profile</h4>
                      {application.student.studentProfile.school && (
                        <p><strong>School:</strong> {application.student.studentProfile.school}</p>
                      )}
                      {application.student.studentProfile.major && (
                        <p><strong>Major:</strong> {application.student.studentProfile.major}</p>
                      )}
                      {application.student.studentProfile.graduationYear && (
                        <p><strong>Graduation Year:</strong> {application.student.studentProfile.graduationYear}</p>
                      )}
                    </div>
                  )}
                </div>

                {application.status === 'submitted' && (
                  <div className="application-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleStatusUpdate(application._id, 'approved')}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleStatusUpdate(application._id, 'rejected')}
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProviderApplications;
