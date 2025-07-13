import './ContactUs.css'; 

function ContactUs() {
  return (
    <div className="contact-us-container">
      <header className="contact-us-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Please reach out using the information below.</p>
      </header>

      <section className="contact-info">
        <h2>Get in Touch</h2>
        <div className="contact-details">
          <div className="contact-item">
            <h3>General Inquiries</h3>
            <p>Email: <a href="mailto:info@[yourwebsite].com">info@[yourwebsite].com</a></p>
            <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
          </div>

          <div className="contact-item">
            <h3>Scholarship Provider Support</h3>
            <p>Email: <a href="mailto:providers@[yourwebsite].com">providers@[yourwebsite].com</a></p>
            <p>Phone: <a href="tel:+1234567891">+1 (234) 567-891</a></p>
          </div>

          <div className="contact-item">
            <h3>Technical Support</h3>
            <p>Email: <a href="mailto:support@[yourwebsite].com">support@[yourwebsite].com</a></p>
          </div>

          <div className="contact-item">
            <h3>Address</h3>
            <p>[Your Company Name/Organization]</p>
            <p>[Your Street Address]</p>
            <p>[City, State, Zip Code]</p>
            <p>[Country]</p>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <h2>Send Us a Message</h2>
        <p>While we don't have a direct form here, you can email us at the addresses above or use the details below.</p>
        {/*
          You would typically put a form here, e.g.:
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        */}
      </section>

      <footer className="contact-us-footer">
        <p>We aim to respond to all inquiries within 24-48 business hours.</p>
      </footer>
    </div>
  );
}

export default ContactUs;