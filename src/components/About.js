import React from 'react';
import { Link } from 'react-router-dom';
import '../css/About.css';

const teamMembers = [
  {
    name: 'Danyael Kaye Apil',
    role: 'Group Leader, Documentation',
    image: '/Members/Apil.jpg',
    bio: 'Coordinated group activities and contributed to project documentation and paper.'
  },
  {
    name: 'Jacques Lynn Toledo',
    role: 'Research & Documentation',
    image: '/Members/Toledo.jpg',
    bio: 'Assisted in research, writing, and editing the capstone paper.'
  },
  {
    name: 'Shane Salonga',
    role: 'Research & Documentation',
    image: '/Members/Salonga.jpg',
    bio: 'Helped with literature review and project documentation.'
  },
  {
    name: 'John Peter Gonzales',
    role: 'Research & Documentation',
    image: '/Members/Gonzales.jpg',
    bio: 'Supported the team in writing and organizing the capstone paper.'
  },
  {
    name: 'John Nikko B. Arangorin',
    role: 'Lead Developer, Full Stack Programmer',
    image: '/Members/Arangorin.jpg',
    bio: 'Main programmer and system designer for the Tenant Portal web application.'
  },
];


const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Tenant Portal</h1>
      </div>

      <section className="about-system-section">
        <h2>What is Tenant Portal?</h2>
        <p className="project-description">
          Tenant Portal is a web-based system designed to simplify apartment living for tenants and property managers. It provides a secure platform for tenants to submit maintenance requests, track complaint status, log visitor information, and access rental agreements—all in one place. The system streamlines communication, enhances security, and helps both tenants and admins manage daily apartment operations efficiently.
        </p>
      </section>

      <section className="about-features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span role="img" aria-label="Maintenance" className="feature-icon">🛠️</span>
            <h3>Maintenance Requests</h3>
            <p>Submit and track complaints for quick resolution.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="Visitor" className="feature-icon">🧑‍💼</span>
            <h3>Visitor Logs</h3>
            <p>Record and manage visitor entries for added security.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="Rental" className="feature-icon">📄</span>
            <h3>Rental Information</h3>
            <p>Access agreements and confirmation statements.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="Profile" className="feature-icon">👤</span>
            <h3>Profile Management</h3>
            <p>Update personal details and view account status.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="Admin" className="feature-icon">🗂️</span>
            <h3>Admin Dashboard</h3>
            <p>Manage tenant accounts, complaints, and visitor logs.</p>
          </div>
        </div>
      </section>

      <section className="about-team-section">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="member-card" key={index}>
              <img src={member.image} alt={member.name} className="member-photo" />
              <h3>{member.name}</h3>
              <p><strong>{member.role}</strong></p>
              {member.bio && <p className="member-bio">{member.bio}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="about-footer">
        <p>For questions or support, visit our <Link to="/contact-us">Contact Us</Link> page.</p>
        <div className="about-back-button-container">
          <Link to="/" className="about-back-button">Back</Link>
        </div>
      </footer>
    </div>
  );
};

export default About;