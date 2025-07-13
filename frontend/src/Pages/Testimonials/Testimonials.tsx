import './Testimonials.css';
function Testimonials() {
  const testimonialsData = [
    {
      id: 1,
      quote: "Thanks to this platform, I found the perfect scholarship that covered my tuition. I'm now pursuing my dream degree!",
      author: "Jane Doe",
      title: "Scholarship Recipient, Computer Science",
    },
    {
      id: 2,
      quote: "The platform is incredibly easy to navigate. I appreciated the curated list of scholarships relevant to my field. Highly recommended!",
      author: "John Smith",
      title: "Scholarship Recipient, Mechanical Engineering",
    },
    {
      id: 3,
      quote: "As a scholarship provider, this platform has been instrumental in helping us connect with deserving students. The process is seamless.",
      author: "Dr. Emily Chen",
      title: "Director, Global Education Foundation",
    },
    {
      id: 4,
      quote: "I was overwhelmed by the scholarship search until I found this website. The resources and clear application steps made all the difference.",
      author: "Maria Garcia",
      title: "Scholarship Recipient, Nursing",
    },
  ];

  return (
    <div className="testimonials-container">
      <header className="testimonials-header">
        <h1>What Our Users Say</h1>
        <p>Hear inspiring stories from scholarship recipients and partners who have benefited from our platform.</p>
      </header>

      <div className="testimonials-grid">
        {testimonialsData.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-quote-icon">❝</div>
            <p className="testimonial-quote">{testimonial.quote}</p>
            <div className="testimonial-author-info">
             
              <div className="testimonial-author-details">
                <p className="testimonial-author-name">{testimonial.author}</p>
                <p className="testimonial-author-title">{testimonial.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="testimonials-footer">
        <p>Join our community and start your success story today!</p>
      </footer>
    </div>
  );
}

export default Testimonials;