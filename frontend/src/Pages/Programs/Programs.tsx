import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Programs.css';

function Programs() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetch('https://web-project-2-6qor.onrender.com/api/scholarships')
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
              <div className="program-header">
                <div className="program-meta">
                  <div className="program-badges">
                    <span className="badge badge-level">{program.category}</span>
                  </div>
                </div>
                <h3 className="program-title">{program.title}</h3>
                <div className="program-provider">{program.provider?.firstName || 'Provider'} {program.provider?.lastName || ''}</div>
              </div>
              <div className="program-body">
                <p className="program-description">{program.description}</p>
                <div className="program-details">
                  <div className="detail-item">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value">${program.amount} {program.currency}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Deadline</span>
                    <span className="detail-value">{new Date(program.deadline).toLocaleDateString()}</span>
                  </div>
                  {program.eligibility?.minGPA && (
                    <div className="detail-item">
                      <span className="detail-label">Min GPA</span>
                      <span className="detail-value">{program.eligibility.minGPA}</span>
                    </div>
                  )}
                  {program.eligibility?.schoolLevel && (
                    <div className="detail-item">
                      <span className="detail-label">Education Level</span>
                      <span className="detail-value">{program.eligibility.schoolLevel}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="program-footer">
                <div className="program-actions">
                  <Link to="/apply" className="btn btn-primary">Apply Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Programs;
