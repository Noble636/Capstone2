import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ContactUs.css";

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div className="contactus-container">
      <div className="contactus-box">
        <h1 className="contactus-title">Contact Us</h1>
        <p className="contactus-desc">
          If you have questions about the program application please contact the following:
        </p>

        <div className="contactus-apartment-info" style={{ margin: "32px 0" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>RMR Apartment</div>
          <div style={{ fontSize: "1.15rem", marginTop: "8px", color: "#444" }}>
            Owner: Divina Barboza Catabay
          </div>
          <div style={{ fontSize: "1.1rem", marginTop: "4px", color: "#444" }}>
            <span role="img" aria-label="email">📧</span>
            <a
              href="mailto:divine829@gmail.com"
              style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none", marginLeft: "4px" }}
              onMouseOver={e => (e.target.style.textDecoration = "underline")}
              onMouseOut={e => (e.target.style.textDecoration = "none")}
            >
              divine829@gmail.com
            </a>
          </div>
        </div>

        <div className="contactus-developers-label" style={{ marginTop: "28px", display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span role="img" aria-label="team">👥</span> Developers:
        </div>
        <ul className="contactus-developer-list" style={{ marginTop: "10px", marginBottom: 0, paddingLeft: "20px" }}>
          <li style={{ marginBottom: "14px" }}>
            <div className="contactus-developer-name"><span role="img" aria-label="person">🧑‍💻</span> Danyael Kaye C. Apil</div>
            <div className="contactus-developer-email">
              <a href="mailto:klmnopq1221@gmail.com">klmnopq1221@gmail.com</a>
            </div>
          </li>
          <li style={{ marginBottom: "14px" }}>
            <div className="contactus-developer-name"><span role="img" aria-label="person">🧑‍💻</span> Jacques Lynn Toeldo</div>
            <div className="contactus-developer-email">
              <a href="mailto:jaiddes6@gmail.com">jaiddes6@gmail.com</a>
            </div>
          </li>
          <li style={{ marginBottom: "14px" }}>
            <div className="contactus-developer-name"><span role="img" aria-label="person">🧑‍💻</span> Shane Salonga</div>
            <div className="contactus-developer-email">
              <a href="mailto:shanesalonga736@gmail.com">shanesalonga736@gmail.com</a>
            </div>
          </li>
          <li style={{ marginBottom: "14px" }}>
            <div className="contactus-developer-name"><span role="img" aria-label="person">🧑‍💻</span> John Peter Gonzales</div>
            <div className="contactus-developer-email">
              <a href="mailto:pedromeh21@gmail.com">pedromeh21@gmail.com</a>
            </div>
          </li>
          <li>
            <div className="contactus-developer-name"><span role="img" aria-label="person">🧑‍💻</span> John Nikko B. Arangorin</div>
            <div className="contactus-developer-email">
              <a href="mailto:nikkoarangorin004@gmail.com">nikkoarangorin004@gmail.com</a>
            </div>
          </li>
        </ul>
        <hr style={{margin:'32px 0', border:'none', borderTop:'2px dashed #b0e0ff'}} />
        <div style={{textAlign:'center', marginBottom:'8px', fontSize:'1.1rem', color:'#333'}}>
          <span role="img" aria-label="info">ℹ️</span> For general inquiries, please email any of the team members above.<br/>
          <span role="img" aria-label="support">💬</span> We aim to respond as soon as possible!
        </div>
      </div>
      <div className="contact-back-button-container">
        <button className="contact-back-button" onClick={() => navigate("/")}>
          &#x2B05; Back
        </button>
      </div>
    </div>
  );
};

export default ContactUs;