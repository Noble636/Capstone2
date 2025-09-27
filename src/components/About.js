import React from 'react';
import { Link } from 'react-router-dom';
import '../css/About.css';

const teamMembers = [
  {
    name: 'Danyael Kaye Apil',
    role: 'Group Leader',
    image: '/Members/Apil.jpg',
  },
  {
    name: 'Jacques Lynn Toledo',
    role: 'Member',
    image: '/Members/Toledo.jpg',
  },
  {
    name: 'Shane Salonga',
    role: 'Member',
    image: '/Members/Salonga.jpg',
  },
  {
    name: 'John Peter Gonzales',
    role: 'Member',
    image: '/Members/Gonzales.jpg',
  },
  {
    name: 'John Nikko B. Arangorin',
    role: 'Member',
    image: '/Members/Arangorin.jpg',
  },
];

const About = () => {
  return (
    <div className="about-container">
      <h1>About Our Capstone Project</h1>
      <p className="project-description">
        This project, developed as part of our Capstone 1 requirement, is a Tenant Portal system designed to improve communication and streamline rental processes between tenants and property managers.
        It allows tenants to access rental agreements, view important notices, submit maintenance requests, and manage their profile from a centralized platform.
        Our goal is to provide an efficient, user-friendly, and digital solution to traditional rental operations.
      </p>

      <h2>Meet the Team</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div className="member-card" key={index}>
            <img src={member.image} alt={member.name} className="member-photo" />
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>

      <div className="about-back-button-container">
  <Link to="/" className="about-back-button">Back</Link>
</div>

    </div>
  );
};

export default About;