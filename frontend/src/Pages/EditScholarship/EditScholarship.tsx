import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditScholarship.css';

function EditScholarship() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthorized, setIsAuthorized] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    deadline: '',
    category: '',
    status: 'active',
    minGPA: '',
    schoolLevel: 'any',
    residency: '',
    gender: 'any',
    essayRequired: false,
    transcriptRequired: false,
    recommendationRequired: false,
    recommendationCount: 1
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || (user.role !== 'provider' && user.role !== 'admin')) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    fetchScholarship(token);
  }, [id]);

  const fetchScholarship = async (token: string) => {
    try {
      const response = await fetch(
        `https://web-project-2-6qor.onrender.com/api/scholarships/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        const scholarship = result.data;
        
        setFormData({
          title: scholarship.title || '',
          description: scholarship.description || '',
          amount: scholarship.amount || '',
          currency: scholarship.currency || 'USD',
          deadline: scholarship.deadline?.split('T')[0] || '',
          category: scholarship.category || '',
          status: scholarship.status || 'active',
          minGPA: scholarship.eligibility?.minGPA || '',
          schoolLevel: scholarship.eligibility?.schoolLevel || 'any',
          residency: scholarship.eligibility?.residency || '',
          gender: scholarship.eligibility?.gender || 'any',
          essayRequired: scholarship.requirements?.essay?.required || false,
          transcriptRequired: scholarship.requirements?.transcript || false,
          recommendationRequired: scholarship.requirements?.recommendation?.required || false,
          recommendationCount: scholarship.requirements?.recommendation?.count || 1
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to load scholarship' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('token');

    const payload = {
      title: formData.title,
      description: formData.description,
      amount: formData.amount === '' ? undefined : Number(formData.amount),
      currency: formData.currency,
      deadline: formData.deadline,
      category: formData.category,
      status: formData.status,
      eligibility: {
        minGPA: formData.minGPA === '' ? undefined : Number(formData.minGPA),
        schoolLevel: formData.schoolLevel,
        residency: formData.residency || undefined,
        gender: formData.gender
      },
      requirements: {
        essay: formData.essayRequired ? { required: true } : { required: false },
        transcript: formData.transcriptRequired || false,
        recommendation: {
          required: formData.recommendationRequired || false,
          count: formData.recommendationCount || 1
        }
      }
    };

    try {
      const response = await fetch(
        `https://web-project-2-6qor.onrender.com/api/scholarships/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Scholarship updated successfully!' });
        setTimeout(() => navigate('/manage-scholarships'), 2000);
      } else {
        const errorText = result?.message || 'Failed to update scholarship';
        setMessage({ type: 'error', text: errorText });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setFormLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="edit-scholarship-container">
        <h1>Access Denied</h1>
        <p>Only scholarship providers can edit scholarships.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="edit-scholarship-container"><p>Loading scholarship...</p></div>;
  }

  return (
    <div className="edit-scholarship-container">
      <div className="edit-scholarship-header">
        <h1>Edit Scholarship</h1>
        <p>Update the scholarship details</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="scholarship-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">Scholarship Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Merit-Based Scholarship for Engineering Students"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
              placeholder="Provide a detailed description of the scholarship..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                placeholder="5000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="deadline">Application Deadline *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="academic">Academic</option>
                <option value="athletic">Athletic</option>
                <option value="need-based">Need-Based</option>
                <option value="merit-based">Merit-Based</option>
                <option value="creative">Creative</option>
                <option value="community-service">Community Service</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Eligibility Criteria</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minGPA">Minimum GPA</label>
              <input
                type="number"
                id="minGPA"
                name="minGPA"
                value={formData.minGPA}
                onChange={handleChange}
                min="0"
                max="4"
                step="0.1"
                placeholder="3.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="schoolLevel">Education Level</label>
              <select
                id="schoolLevel"
                name="schoolLevel"
                value={formData.schoolLevel}
                onChange={handleChange}
              >
                <option value="any">Any</option>
                <option value="high-school">High School</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="residency">Residency</label>
              <input
                type="text"
                id="residency"
                name="residency"
                value={formData.residency}
                onChange={handleChange}
                placeholder="e.g., USA, Any"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender Requirement</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Application Requirements</h2>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="essayRequired"
                checked={formData.essayRequired}
                onChange={handleChange}
              />
              <span>Essay Required</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="transcriptRequired"
                checked={formData.transcriptRequired}
                onChange={handleChange}
              />
              <span>Transcript Required</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="recommendationRequired"
                checked={formData.recommendationRequired}
                onChange={handleChange}
              />
              <span>Recommendation Letter Required</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/manage-scholarships')}
            disabled={formLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={formLoading}
          >
            {formLoading ? 'Updating...' : 'Update Scholarship'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditScholarship;
