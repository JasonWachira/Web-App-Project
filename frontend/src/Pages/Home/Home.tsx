import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
  fetch('https://web-project-2-6qor.onrender.com/api/scholarships')
    .then(res => res.json())
    .then(data => {
      console.log("API response:", data);
      setScholarships(data.data?.scholarships || []);
    })
    .catch(err => {
      console.error("Failed to fetch scholarships:", err);
      setScholarships([]);
    });
}, []);
  const filteredScholarships = scholarships.filter(item => {
  const name = item.name ?? '';
  const description = item.description ?? '';
  const type = item.level ?? '';

  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    description.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesFilter =
    filter === 'All' || type.toLowerCase() === filter.toLowerCase();

  return matchesSearch && matchesFilter;
});

  return (
    <div className="flex-container">
      <nav className="nav-bar">
        <div className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/programs">PROGRAMS</Link>
          <Link to="/contact">CONTACT US</Link>
          <Link to="/about">ABOUT US</Link>
          <Link to="/testimonials">Testimonials</Link>
          {localStorage.getItem('token') && <Link to="/dashboard">DASHBOARD</Link>}
        </div>
        <div className="auth-links">
  {!localStorage.getItem("token") ? (
    <>
      <a href="/auth" className="login">LOGIN</a>
      <a href="/auth" className="signup">SIGN UP</a>
    </>
  ) : (
    <button
      className="logout"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth"); 
      }}
    >
      LOGOUT
    </button>
  )}
</div>
      </nav>

      <section className="hero-section">
        <div className="assert">Your #1 Scholarship Platform</div>
        <div className="inspirational-text">Education opens doors—<br />your journey starts here.</div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Available Scholarships</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Partner Universities</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50,000+</span>
            <span className="stat-label">Success Stories</span>
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="search-container">
          <form className="search-form" onSubmit={e => e.preventDefault()}>
            <input
              className="search-input"
              type="text"
              placeholder="Search programs, universities or fields"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button className="search-button">Search</button>
          </form>
          <div className="search-filters">
            {['All', 'Undergraduate', 'Graduate', 'PhD', 'Research'].map(type => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="main-content">
        <div className="section-header">
          <div className="discover">Discover scholarships from the best universities in the world</div>
          <p className="section-subtitle">Explore opportunities from prestigious institutions worldwide and take the first step towards your academic dreams.</p>
        </div>

        <div className="card-container" id="cardContainer">
          {filteredScholarships.length > 0 ? (
            filteredScholarships.map((item, index) => (
              <div className="scholarship-card" key={index}>
                <h3>{item.name}</h3>
                <p className="location">📍 {item.location}</p>
                <p>{item.description}</p>
                <div className="card-actions">
                  <button className="bookmark-btn">♡</button>
                </div>
              </div>
            ))
          ) : (
            <p>No scholarships found.</p>
          )}
        </div>

        <div className="view-all-container">
          <Link to="/programs" className="view-all">View All Scholarships</Link>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <div className="discover">Why Choose Our Platform?</div>
          <p className="section-subtitle">We provide comprehensive tools and resources to help you find and apply for the perfect scholarships.</p>
        </div>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Advanced filtering and AI-powered recommendations to find scholarships that match your profile perfectly.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📝</div>
            <h3>Application Tracking</h3>
            <p>Keep track of all your applications, deadlines, and requirements in one organized dashboard.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎓</div>
            <h3>Expert Guidance</h3>
            <p>Get personalized advice from education consultants and successful scholarship recipients.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Success Analytics</h3>
            <p>View detailed statistics about your application success rate and areas for improvement.</p>
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Get the latest scholarship opportunities delivered straight to your inbox. Don't miss out on your dream education!</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" className="newsletter-input" placeholder="Enter your email" required />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;
