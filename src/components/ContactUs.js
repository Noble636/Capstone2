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

        <div className="contactus-apartment">RMR Apartment</div>
        <div className="contactus-owner-label" style={{ marginTop: "18px" }}>Owner:</div>
        <ul className="contactus-owner-list" style={{ marginTop: "10px", marginBottom: 0, paddingLeft: "20px" }}>
          <li>
            <div className="contactus-owner-name">Divina Barboza Catabay</div>
            <div className="contactus-owner-email">
              <a href="mailto:divine829@gmail.com">divine829@gmail.com</a>
            </div>
          </li>
        </ul>

        <div className="contactus-developers-label" style={{ marginTop: "28px" }}>
          Developers:
        </div>
        <ul className="contactus-developer-list" style={{ marginTop: "10px", marginBottom: 0, paddingLeft: "20px" }}>
          <li style={{ marginBottom: "14px" }}>
            <div className="contactus-developer-name">John Nikko B. Arangorin</div>
            <div className="contactus-developer-email">
              <a href="mailto:nikkoarangorin004@gmail.com">nikkoarangorin004@gmail.com</a>
            </div>
          </li>
          <li>
            <div className="contactus-developer-name">Jacques Lynn Toeldo</div>
            <div className="contactus-developer-email">
              <a href="mailto:jaiddes6@gmail.com">jaiddes6@gmail.com</a>
            </div>
          </li>
        </ul>
      </div>
      <div className="contact-back-button-container">
        <button className="contact-back-button" onClick={() => navigate(-1)}>
          &#x2B05; Back
        </button>
      </div>
    </div>
  );
};

export default ContactUs;