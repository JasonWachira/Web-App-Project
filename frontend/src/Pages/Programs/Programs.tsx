import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Programs.css';

function Programs() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/scholarships')
      .then(res => res.json())
      .then(data => {
        setPrograms(data?.data?.scholarships || []);
      })
      .catch(err => {
        console.error('Failed to fetch programs:', err);
      });
  }, []);

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/programs" className="active">PROGRAMS</Link>
          <Link to="/about">ABOUT US</Link>
          <Link to="/contact">CONTACTS</Link>
        </div>
        
      </nav>

      <header className="page-header">
        <h1 className="page-title">Scholarship Programs</h1>
        <p className="page-subtitle">Discover thousands of scholarship opportunities from top universities worldwide.</p>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>Programs</span>
        </div>
      </header>

      

      <main className="main-content">
        <div className="results-header">
          <div className="results-count">
            Showing <strong>{programs.length}</strong> programs
          </div>
        </div>

        <div className="programs-grid">
          {programs.map((program, index) => (
            <div className="program-card" key={index}>
              {program.featured && <div className="featured-badge">⭐ Featured</div>}
              <div className="program-header">
                <div className="program-meta">
                  
                  <div className="program-badges">
                    <span className="badge badge-level">{program.level}</span>
                    <span className="badge badge-type">{program.type}</span>
                    <span className="badge badge-deadline">{program.deadline}</span>
                  </div>
                </div>
                <h3 className="program-title">{program.title}</h3>
                <div className="university-name">{program.university}</div>
                <div className="program-location">📍 {program.location}</div>
              </div>
              <div className="program-body">
                <p className="program-description">{program.description}</p>
                <div className="program-details">
                  <div className="detail-item">
                    <span className="detail-label">Funding Amount</span>
                    <span className="detail-value">{program.funding}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{program.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Eligibility</span>
                    <span className="detail-value">{program.eligibility}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">GPA Requirement</span>
                    <span className="detail-value">{program.gpa}</span>
                  </div>
                </div>
              </div>
              <div className="program-footer">
                <div className="program-actions">
                  <Link to="/apply" className="btn btn-primary">Apply Now</Link>
                </div>
                <button className="bookmark-btn" title="Bookmark">♡</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Programs;
