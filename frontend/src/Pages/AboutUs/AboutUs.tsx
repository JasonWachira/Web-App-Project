import './AboutUs.css';

function AboutUs(){
    return(
        <div className="about-us-container">
            <header className="about-us-header">
                <h1>About our Platform</h1>
            </header>
            <section className="about-us-mission">
                <h2>Our mission</h2>
                <p>Our mission is to bridge the gap between aspiring students and life-changing educational opportunities. We believe that financial constraints should never hinder a student's potential. Our platform is dedicated to empowering individuals by connecting them with a diverse range of scholarships that align with their academic goals and personal aspirations.</p>
            </section>
            <section className="about-us-vision">
                <h2>Our vision</h2>
                    <p>
                        We envision a world where every student, regardless of their background, has the resources to pursue higher education. By simplifying the scholarship search and application process, we aim to foster a generation of educated leaders, innovators, and thinkers who will contribute positively to society.
                    </p>

            </section>
            <section className="about-us-what-we-do">
                <h2>What We Do</h2>
                <p>We provide a comprehensive and user-friendly platform that:</p>
                <ul>
                    <li>**Aggregates Scholarships:** We bring together scholarships from various providers, institutions, and organizations worldwide.</li>
                    <li>**Simplifies Search:** Our advanced search and filtering tools help students quickly find scholarships relevant to their field of study, location, academic level, and more.</li>
                    <li>**Streamlines Applications:** We offer tools and guidance to help students prepare and submit strong scholarship applications.</li>
                    <li>**Offers Resources:** Beyond listings, we provide articles, tips, and resources on essay writing, interview preparation, and financial aid.</li>
                    <li>**Connects Communities:** We foster a community where students can share experiences and support each other.</li>
                </ul>
            </section>
            <section className="about-us-our-values">
                <h2>Our Values</h2>
                <ul>
                    <li>**Accessibility:** Making education accessible to all.</li>
                    <li>**Transparency:** Providing clear and accurate scholarship information.</li>
                    <li>**Empowerment:** Equipping students with the tools for success.</li>
                    <li>**Integrity:** Maintaining trust and credibility in all our operations.</li>
                    <li>**Community:** Building a supportive network for students and providers.</li>
                </ul>
            </section>
            <footer className="about-us-footer">
                <p>Thank you for being a part of our journey. Together, we can unlock countless futures.</p>
            </footer>
        </div>

    );
}

export default AboutUs;