import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageScholarships.css';

function ManageScholarships() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthorized, setIsAuthorized] = useState(false);

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
    fetchScholarships(token);
  }, []);

  const fetchScholarships = async (token: string) => {
    try {
      const response = await fetch(
        'https://web-project-2-6qor.onrender.com/api/scholarships',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        // Filter to show only provider's scholarships
        const allScholarships = result.data?.scholarships || [];
        setScholarships(allScholarships);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch scholarships' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scholarshipId: string) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `https://web-project-2-6qor.onrender.com/api/scholarships/${scholarshipId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setScholarships(prev => prev.filter(s => s._id !== scholarshipId));
        setMessage({ type: 'success', text: 'Scholarship deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete scholarship' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="manage-scholarships-container">
        <h1>Access Denied</h1>
        <p>Only scholarship providers can access this page.</p>
        <button onClick={() => navigate('/auth')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="manage-scholarships-container">
      <div className="manage-header">
        <h1>Manage Your Scholarships</h1>
        <p>View, edit, and delete your scholarship offerings</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p>Loading scholarships...</p>
      ) : scholarships.length === 0 ? (
        <div className="no-scholarships">
          <p>You haven't created any scholarships yet.</p>
          <button onClick={() => navigate('/add-scholarship')} className="btn-primary">
            Create Your First Scholarship
          </button>
        </div>
      ) : (
        <div className="scholarships-grid">
          {scholarships.map((scholarship) => (
            <div className="scholarship-card" key={scholarship._id}>
              <div className="card-header">
                <h3>{scholarship.title}</h3>
                <div className="status-badge" data-status={scholarship.status}>
                  {scholarship.status}
                </div>
              </div>

              <div className="card-body">
                <p className="description">{scholarship.description.substring(0, 150)}...</p>
                
                <div className="details">
                  <div className="detail-item">
                    <span className="label">Amount:</span>
                    <span className="value">${scholarship.amount} {scholarship.currency}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Category:</span>
                    <span className="value">{scholarship.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Deadline:</span>
                    <span className="value">{new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Applications:</span>
                    <span className="value">{scholarship.currentApplications || 0}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="btn-edit"
                  onClick={() => navigate(`/edit-scholarship/${scholarship._id}`)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(scholarship._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageScholarships;
