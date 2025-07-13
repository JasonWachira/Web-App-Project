import  { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Apply.css';

function ScholarshipApplication() {
  const [formData, setFormData] = useState({
    scholarshipTitle: '', 
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',

    currentEducationLevel: '',
    institution: '',
    fieldOfStudy: '',
    gpa: '',
    graduationDate: '',
    previousDegree: '',
    previousInstitution: '',

    scholarshipType: '',
    preferredCountry: '',
    preferredUniversity: '',
    intendedMajor: '',

    personalStatement: '',
    whyDeserveScholarship: '',
    careerGoals: '',

    extracurriculars: '',
    workExperience: '',
    achievements: '',
    financialNeed: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [loadingScholarships, setLoadingScholarships] = useState(true);
  const [scholarships, setScholarships] = useState([]);
  const [submissionMessage, setSubmissionMessage] = useState({ type: '', text: '' });
  const [scholarshipError, setScholarshipError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoadingScholarships(true);
        const response = await fetch('http://localhost:5000/api/scholarships/active');
        if (!response.ok) {
          throw new Error('Failed to fetch scholarships');
        }
        const data = await response.json();
        setScholarships(data.data || []);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
        setScholarshipError('Could not load scholarships. Please try again later.');
      } finally {
        setLoadingScholarships(false);
      }
    };

    fetchScholarships();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  const nextStep = () => {
    if (currentStep === 1 && !formData.scholarshipTitle) {
      setSubmissionMessage({ type: 'error', text: 'Please select a scholarship to apply for.' });
      return;
    }
    setSubmissionMessage({ type: '', text: '' });
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setSubmissionMessage({ type: '', text: '' });
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.scholarshipTitle) {
    setSubmissionMessage({ type: 'error', text: 'Please select a scholarship before submitting.' });
    return;
  }

  setLoadingSubmission(true);
  setSubmissionMessage({ type: '', text: '' });

  const token = localStorage.getItem("token");
  if (!token) {
    setSubmissionMessage({ type: 'error', text: 'You must be logged in to apply.' });
    setLoadingSubmission(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData) 
    });

    const result = await response.json();

    if (response.ok) {
      
      setSubmissionMessage({ type: 'success', text: result.message || 'Application submitted successfully!' });
      navigate('/')
    } else {
      setSubmissionMessage({ type: 'error', text: result.message || `Failed to submit application: ${response.statusText}` });
    }
  } catch (error) {
    console.error('Submission error:', error);
    setSubmissionMessage({ type: 'error', text: 'Network error. Please try again.' });
  } finally {
    setLoadingSubmission(false);
  }
};
  const renderProgressBar = () => (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="progress-steps">
        {[1, 2, 3, 4].map(step => (
          <div
            key={step}
            className={`progress-step ${currentStep >= step ? 'active' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="form-section">
      <h2>Personal Information</h2>
      <div className="form-grid">
        
        <div className="form-group full-width">
          <label>Select Scholarship *</label>
          {loadingScholarships ? (
            <p>Loading scholarships...</p>
          ) : scholarshipError ? (
            <p className="error-message">{scholarshipError}</p>
          ) : (
            <select
              name="scholarshipTitle"
              value={formData.scholarshipTitle}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Select a Scholarship --</option>
              {scholarships.map(s => (
                <option key={s._id} value={s.title}> 
                  {s.title} ({s.amount})
                </option>
              ))}
            </select>
          )}
        </div>
        

        <div className="form-group">
          <label>First Name *</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email Address *</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Date of Birth *</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Nationality *</label>
          <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} required />
        </div>
        <div className="form-group full-width">
          <label>Address *</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>City *</label>
          <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>State/Province *</label>
          <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>ZIP/Postal Code *</label>
          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
        </div>
      </div>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="form-section">
      <h2>Academic Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Current Education Level *</label>
          <select name="currentEducationLevel" value={formData.currentEducationLevel} onChange={handleInputChange} required>
            <option value="">Select Level</option>
            <option value="high-school">High School</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Current Institution *</label>
          <input type="text" name="institution" value={formData.institution} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Field of Study *</label>
          <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>GPA/Grade Average *</label>
          <input type="text" name="gpa" value={formData.gpa} onChange={handleInputChange} placeholder="e.g., 3.8/4.0 or 85%" required />
        </div>
        <div className="form-group">
          <label>Expected Graduation Date *</label>
          <input type="date" name="graduationDate" value={formData.graduationDate} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Previous Degree (if applicable)</label>
          <input type="text" name="previousDegree" value={formData.previousDegree} onChange={handleInputChange} placeholder="e.g., Bachelor of Science" />
        </div>
        <div className="form-group full-width">
          <label>Previous Institution (if applicable)</label>
          <input type="text" name="previousInstitution" value={formData.previousInstitution} onChange={handleInputChange} />
        </div>
      </div>
    </div>
  );

  const renderScholarshipDetails = () => (
    <div className="form-section">
      <h2>Scholarship Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Scholarship Type *</label>
          <select name="scholarshipType" value={formData.scholarshipType} onChange={handleInputChange} required>
            <option value="">Select Type</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="phd">PhD</option>
            <option value="research">Research</option>
            <option value="exchange">Exchange Program</option>
          </select>
        </div>
        <div className="form-group">
          <label>Preferred Country *</label>
          <select name="preferredCountry" value={formData.preferredCountry} onChange={handleInputChange} required>
            <option value="">Select Country</option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="canada">Canada</option>
            <option value="australia">Australia</option>
            <option value="germany">Germany</option>
            <option value="france">France</option>
            <option value="netherlands">Netherlands</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Preferred University</label>
          <input type="text" name="preferredUniversity" value={formData.preferredUniversity} onChange={handleInputChange} placeholder="Enter university name (optional)" />
        </div>
        <div className="form-group full-width">
          <label>Intended Major/Field of Study *</label>
          <input type="text" name="intendedMajor" value={formData.intendedMajor} onChange={handleInputChange} required />
        </div>
      </div>
    </div>
  );

  const renderEssays = () => (
    <div className="form-section">
      <h2>Essays & Personal Statements</h2>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Personal Statement *</label>
          <textarea name="personalStatement" value={formData.personalStatement} onChange={handleInputChange} rows="8" placeholder="Tell us about yourself, your background, and what drives you to pursue higher education..." required />
          <div className="char-count">{formData.personalStatement.length}/2000</div>
        </div>
        <div className="form-group full-width">
          <label>Why Do You Deserve This Scholarship? *</label>
          <textarea name="whyDeserveScholarship" value={formData.whyDeserveScholarship} onChange={handleInputChange} rows="6" placeholder="Explain why you are the ideal candidate for this scholarship..." required />
          <div className="char-count">{formData.whyDeserveScholarship.length}/1500</div>
        </div>
        <div className="form-group full-width">
          <label>Career Goals & Aspirations *</label>
          <textarea name="careerGoals" value={formData.careerGoals} onChange={handleInputChange} rows="6" placeholder="Describe your career goals and how this scholarship will help you achieve them..." required />
          <div className="char-count">{formData.careerGoals.length}/1500</div>
        </div>
      </div>
    </div>
  );

  

  return (
    <div className="application-container">
      <nav className="nav-bar">
        <div className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/programs">PROGRAMS</Link>
          <Link to="/contacts">CONTACT US</Link>
          <Link to="/">ABOUT US</Link>
        </div>
      </nav>

      <div className="application-hero">
        <div className="hero-content">
          <h1>Scholarship Application</h1>
          <p>Take the first step towards your academic dreams</p>
        </div>
      </div>

      <div className="application-form-container">
        {renderProgressBar()}

        {submissionMessage.text && (
          <div className={`submission-message ${submissionMessage.type}`}>
            {submissionMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="application-form">
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderAcademicInfo()}
          {currentStep === 3 && renderScholarshipDetails()}
          {currentStep === 4 && renderEssays()}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="nav-btn prev-btn" disabled={loadingSubmission}>
                Previous
              </button>
            )}
            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="nav-btn next-btn" disabled={loadingSubmission || loadingScholarships}>
                Next
              </button>
            ) : (
              <button type="submit" className="nav-btn submit-btn" disabled={loadingSubmission}>
                {loadingSubmission ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScholarshipApplication;