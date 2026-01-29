import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddScholarship.css';

function AddScholarship() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = user?.role;

    if (!user || (role !== 'provider' && role !== 'admin')) {
      setIsAuthorized(false);
      setMessage({
        type: 'error',
        text: 'Only scholarship providers can access this page. Please log in with a provider account.'
      });
    }
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    deadline: '',
    category: '',
    status: 'active',
    eligibility: {
      minGPA: '',
      schoolLevel: 'any',
      residency: '',
      gender: 'any'
    },
    requirements: {
      essay: { required: false, prompt: '' },
      transcript: false,
      recommendation: { required: false, count: 1 }
    }
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;

    if (!name.includes('.')) {
      setFormData(prev => ({
        ...prev,
        [name]: nextValue
      }));
      return;
    }

    const path = name.split('.');
    setFormData(prev => {
      const updated: any = { ...prev };
      let cursor: any = updated;

      for (let i = 0; i < path.length - 1; i += 1) {
        const key = path[i];
        cursor[key] = { ...(cursor[key] || {}) };
        cursor = cursor[key];
      }

      cursor[path[path.length - 1]] = nextValue;
      return updated;
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const role = user?.role;

    if (!token || !user || (role !== 'provider' && role !== 'admin')) {
      setMessage({ type: 'error', text: 'You must be logged in as a provider to create scholarships.' });
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      amount: formData.amount === '' ? undefined : Number(formData.amount),
      eligibility: {
        ...formData.eligibility,
        minGPA:
          formData.eligibility.minGPA === ''
            ? undefined
            : Number(formData.eligibility.minGPA),
        residency: formData.eligibility.residency || undefined
      },
      requirements: {
        ...formData.requirements,
        recommendation: {
          ...formData.requirements.recommendation,
          count: formData.requirements.recommendation.count || 1
        }
      }
    };

    try {
      const response = await fetch('https://web-project-2-6qor.onrender.com/api/scholarships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Scholarship created successfully!' });
        setTimeout(() => navigate('/programs'), 2000);
      } else {
        const errorText = result?.message || result?.errors?.[0]?.msg || 'Failed to create scholarship';
        setMessage({ type: 'error', text: errorText });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-scholarship-container">
      <div className="add-scholarship-header">
        <h1>Create New Scholarship</h1>
        <p>Fill in the details to add a scholarship opportunity</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="scholarship-form">
        {!isAuthorized && (
          <div className="message error">
            You do not have access to create scholarships.
          </div>
        )}
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
        </div>

        <div className="form-section">
          <h2>Eligibility Criteria</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eligibility.minGPA">Minimum GPA</label>
              <input
                type="number"
                id="eligibility.minGPA"
                name="eligibility.minGPA"
                value={formData.eligibility.minGPA}
                onChange={handleChange}
                min="0"
                max="4"
                step="0.1"
                placeholder="3.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="eligibility.schoolLevel">Education Level</label>
              <select
                id="eligibility.schoolLevel"
                name="eligibility.schoolLevel"
                value={formData.eligibility.schoolLevel}
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
              <label htmlFor="eligibility.residency">Residency</label>
              <input
                type="text"
                id="eligibility.residency"
                name="eligibility.residency"
                value={formData.eligibility.residency}
                onChange={handleChange}
                placeholder="e.g., USA, Any"
              />
            </div>

            <div className="form-group">
              <label htmlFor="eligibility.gender">Gender Requirement</label>
              <select
                id="eligibility.gender"
                name="eligibility.gender"
                value={formData.eligibility.gender}
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
                name="requirements.essay.required"
                checked={formData.requirements.essay.required}
                onChange={handleChange}
              />
              <span>Essay Required</span>
            </label>
          </div>

          {formData.requirements.essay.required && (
            <div className="form-group">
              <label htmlFor="requirements.essay.prompt">Essay Prompt</label>
              <textarea
                id="requirements.essay.prompt"
                name="requirements.essay.prompt"
                value={formData.requirements.essay.prompt}
                onChange={handleChange}
                rows={3}
                placeholder="What are your career goals?"
              />
            </div>
          )}

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="requirements.transcript"
                checked={formData.requirements.transcript}
                onChange={handleChange}
              />
              <span>Transcript Required</span>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="requirements.recommendation.required"
                checked={formData.requirements.recommendation.required}
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
            onClick={() => navigate('/programs')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !isAuthorized}
          >
            {loading ? 'Creating...' : 'Create Scholarship'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddScholarship;
