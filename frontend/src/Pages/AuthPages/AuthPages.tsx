import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../AuthPages/AuthPages.css';

function AuthPages() {
  const navigate = useNavigate();
  const [isLogin, setLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(resData.message || 'Something went wrong');
    }

    console.log("✅ Login/Signup response:", resData);

    
    const user = resData.data;
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));

    
    navigate("/"); 

  } catch (err) {
    console.error("Error:", err.message);
    alert(err.message);
  }
};


  const toggleAuthMode = () => {
    setLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: '',
    });
  };

  return (
    <div className="auth-container">
      <nav className="nav-bar">
        <div className="nav-links">
          <a href="/">HOME</a>
          <a href="/programs">PROGRAMS</a>
          <a href="/contacts">CONTACT US</a>
          <a href="/">ABOUT US</a>
        </div>
      </nav>

      <div className="auth-content">
        <div className="auth-background">
          <div className="auth-overlay">
            <div className="auth-stats">
              <div className="stat-item">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Students Helped</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$500M+</span>
                <span className="stat-label">Scholarships Awarded</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Partner Universities</span>
              </div>
            </div>
            <div className="auth-testimonial">
              <p>
                "This platform helped me find my dream scholarship to study at MIT.
                The process was seamless and the support was incredible."
              </p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>MIT Graduate Student</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-section">
          {isLogin ? (
            <LoginForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              toggleAuthMode={toggleAuthMode}
            />
          ) : (
            <SignupForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              toggleAuthMode={toggleAuthMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
function LoginForm({ formData, handleChange, handleSubmit, toggleAuthMode }) {
  return (
    <form className='auth-form-container' onSubmit={handleSubmit}>
      <div className='auth-header'>
        <h2>Welcome!</h2>
        <p>Sign in to your account to continue</p>
      </div>
      <div className='auth-form'>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            name='email'
            id='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email address'
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            id='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            required
          />
        </div>
        <button type='submit' className='auth-btn primary'>
          Sign in
        </button>
        <div className="auth-switch">
          <p>Don't have an account?</p>
          <button type="button" onClick={toggleAuthMode} className="switch-btn">
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
}

function SignupForm({ formData, handleChange, handleSubmit, toggleAuthMode }) {
  return (
    <form className='auth-form-container' onSubmit={handleSubmit}>
      <div className='auth-header'>
        <h1>Create Account</h1>
        <p>Join thousands of students finding their dream scholarships</p>
      </div>
      <div className='auth-form'>
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor="firstName">First Name</label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              placeholder='First Name'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              placeholder='Last Name'
            />
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='role'>Role</label>
          <select
            id='role'
            name='role'
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value=''>Select your role</option>
            <option value='student'>Student</option>
            <option value='provider'>Scholarship Provider</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <button type="submit" className="auth-btn primary">
          Create Account
        </button>
        <div className="auth-switch">
          <p>Already have an account?</p>
          <button type="button" onClick={toggleAuthMode} className="switch-btn">
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
}

export default AuthPages;
