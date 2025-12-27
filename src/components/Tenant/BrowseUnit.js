import React, { useEffect, useState, useRef } from 'react';
import '../css/Tenant/BrowseUnit.css';

export default function BrowseUnitPage() {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showCheckInquiry, setShowCheckInquiry] = useState(false);
  const [tenantNameState, setTenantName] = useState(localStorage.getItem('tenantName') || '');
  const [nameInput, setNameInput] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(!!tenantNameState);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch('https://tenantportal-backend.onrender.com/api/available-units')
      .then(res => res.json())
      .then(data => setUnits(data))
      .catch(() => setUnits([]));
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat, showCheckInquiry]);

  // Polling for new messages every 3 seconds when chat is open
  useEffect(() => {
    let interval;
    if ((showChat || showCheckInquiry) && selectedUnit && nameConfirmed) {
      fetchMessages(selectedUnit.unit_id, tenantNameState);
      interval = setInterval(() => {
        fetchMessages(selectedUnit.unit_id, tenantNameState);
      }, 3000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [showChat, showCheckInquiry, selectedUnit, nameConfirmed]);

  const openChatModal = (unit) => {
    setSelectedUnit(unit);
    setShowChat(true);
    setShowCheckInquiry(false);
    setFeedback('');
    setChatInput('');
    if (tenantNameState) {
      setNameConfirmed(true);
      fetchMessages(unit.unit_id, tenantNameState);
    } else {
      setNameConfirmed(false);
      setNameInput('');
      setMessages([]);
    }
  };

  const openCheckInquiryModal = (unit) => {
    setSelectedUnit(unit);
    setShowCheckInquiry(true);
    setShowChat(false);
    setFeedback('');
    setChatInput('');
    setNameInput('');
    setNameConfirmed(false);
    setMessages([]);
  };

  const closeModal = () => {
    setShowChat(false);
    setShowCheckInquiry(false);
    setSelectedUnit(null);
    setMessages([]);
    setChatInput('');
    setFeedback('');
    setNameInput('');
    setNameConfirmed(!!tenantNameState);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFeedback('Please enter your name.');
      return;
    }
    setTenantName(nameInput.trim());
    localStorage.setItem('tenantName', nameInput.trim());
    setNameConfirmed(true);
    setFeedback('');
    if (selectedUnit) {
      fetchMessages(selectedUnit.unit_id, nameInput.trim());
    }
  };

  const handleCheckInquiryNameSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFeedback('Please enter your name.');
      return;
    }
    setNameConfirmed(true);
    setFeedback('');
    if (selectedUnit) {
      fetchMessages(selectedUnit.unit_id, nameInput.trim());
    }
    setTenantName(nameInput.trim()); // Use this for the session, but do not save to localStorage
  };

  const fetchMessages = async (unitId, name) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `https://tenantportal-backend.onrender.com/api/unit-inquiry-messages?unit_id=${unitId}&sender_name=${encodeURIComponent(name)}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
    setLoadingMessages(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setSending(true);
    setFeedback('');
    try {
      const res = await fetch('https://tenantportal-backend.onrender.com/api/unit-inquiry-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: selectedUnit.unit_id,
          sender_name: tenantNameState,
          sender_type: 'tenant',
          message: chatInput.trim(),
        }),
      });
      if (res.ok) {
        setChatInput('');
        fetchMessages(selectedUnit.unit_id, tenantNameState);
      } else {
        setFeedback('Failed to send message.');
      }
    } catch {
      setFeedback('Server error. Please try again.');
    }
    setSending(false);
  };

  const handleReserve = (unit) => {
    alert(`Reservation requested for unit: ${unit.title || unit.unitName}`);
  };

  return (
    <div className="browseunit-bg">
      <img
        src={process.env.PUBLIC_URL + '/Background/GB.png'}
        alt="Background"
        className="browseunit-bg-image"
      />
      <div className="bubble b1"></div>
      <div className="bubble b2"></div>
      <div className="bubble b3"></div>
      <div className="bubble b4"></div>
      <div className="bubble b5"></div>
      <div className="bubble b6"></div>
      <div className="bubble b7"></div>
      <div className="bubble b8"></div>
    </div>
  );
}