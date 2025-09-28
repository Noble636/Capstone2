import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-box">
        <h1>Privacy Policy</h1>

        <h2>1. Introduction</h2>
        <p>
          Welcome to the Apartment Maintenance: Web-Based Tenant Complaint and Security Management System. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, store, and protect your data when you use our platform. By using our services, you acknowledge and agree to the practices described in this policy. Our system is designed to streamline maintenance requests, enhance security, and provide a safe and efficient living environment for all residents. We encourage you to read this policy carefully to understand your rights and our responsibilities regarding your information.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect the following types of information to provide and improve our services:</p>
        <ul>
          <li><strong>Personal Information:</strong> Your name, contact details (email, phone), apartment unit number, and login credentials are collected during registration and account management.</li>
          <li><strong>Complaint Details:</strong> Information about maintenance issues, security concerns, complaint status updates, and any supporting documentation you provide.</li>
          <li><strong>Visitor Data:</strong> Names and details of visitors you log, including entry and exit times, to ensure the safety and security of all residents.</li>
          <li><strong>Device and Usage Information:</strong> Technical data such as device type, IP address, browser information, and usage logs to help us maintain and improve the system.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>Your information is used for the following purposes:</p>
        <ul>
          <li>To process, track, and resolve maintenance and security complaints efficiently.</li>
          <li>To provide you with real-time updates and notifications regarding your requests and complaints.</li>
          <li>To manage visitor access and maintain a secure environment within the apartment complex.</li>
          <li>To verify your identity and ensure only authorized users can access the system.</li>
          <li>To analyze usage patterns and improve system features, performance, and user experience.</li>
        </ul>

        <h2>4. Information Sharing and Disclosure</h2>
        <p>We may share your information only as necessary for the following reasons:</p>
        <ul>
          <li>With apartment management and maintenance staff to address and resolve your complaints.</li>
          <li>With authorized security personnel for visitor management and safety monitoring.</li>
          <li>With system administrators for platform operation, troubleshooting, and maintenance.</li>
        </ul>
  <p><span className="privacy-policy-we-do-not">We do not</span> sell or share your personal data with third parties for marketing or unrelated purposes. All data sharing is strictly limited to what is necessary for the operation and security of the apartment complex.</p>

        <h2>5. Data Retention</h2>
        <p>
          We retain your personal and complaint data only as long as necessary to provide our services, comply with legal obligations, and resolve disputes. You may request access to or deletion of your data by contacting apartment management. Please note that certain information may be retained for legal or security reasons even after your request.
        </p>

        <h2>6. Security</h2>
        <p>
          We implement industry-standard security measures to protect your information, including user authentication, encrypted data storage, and regular system audits. Access to your data is restricted to authorized personnel only. While we strive to protect your information, no system can guarantee absolute security, so we encourage you to use strong passwords and safeguard your login credentials.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and review your personal data held by the system at any time.</li>
          <li>Request corrections or updates to inaccurate or outdated information.</li>
          <li>Request deletion of your data where applicable, subject to legal and operational requirements.</li>
          <li>Withdraw consent for data processing where permitted by law.</li>
        </ul>
        <p>To exercise these rights, please contact the apartment management office or use the support options within the App. We will respond to your requests promptly and in accordance with applicable laws.</p>

        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted within the App and communicated through official channels. We encourage you to review this policy periodically to stay informed about how we protect your information.
        </p>
      </div>

      <div className="privacy-back-button-container">
        <button className="privacy-back-button" onClick={() => navigate("/")}>
          &#x2B05; Back
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;