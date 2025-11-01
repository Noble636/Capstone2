import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';

import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminComplaints from './components/Admin/AdminComplaints';
import AdminVisitorLogs from './components/Admin/AdminVisitorLogs';
import ManageAccounts from './components/Admin/ManageAccounts';
import AdminRegister from './components/Admin/AdminRegister';
import AdminFPW from './components/Admin/AdminFPW';

import Complaints from './components/Tenant/SubmitComplaints';
import VisitorLogs from './components/Tenant/SubmitVisitors';
import TenantLogin from './components/Tenant/TenantLogin';
import TenantDashboard from './components/Tenant/TenantDashboard';
import TenantRegister from './components/Tenant/TenantRegister';
import RentalInformation from './components/Tenant/RentalInformation';
import RentalAgreement from './components/Tenant/RentalAgreement';
import RentalConfirmation from './components/Tenant/RentalConfirmation';
import EditAccount from './components/Tenant/EditAccount';
import EditComplaints from './components/Tenant/EditComplaints';
import ComplaintStatus from './components/Tenant/ComplaintStatus';
import TenantFPW from './components/Tenant/TenantFPW';

import ContactUs from './components/ContactUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-complaints" element={<AdminComplaints />} />
        <Route path="/admin-visitors" element={<AdminVisitorLogs />} />
        <Route path="/admin-manage-accounts" element={<ManageAccounts />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-forgot-password" element={<AdminFPW />} />
        <Route path="/tenant-login" element={<TenantLogin />} />
        <Route path="/tenant-dashboard" element={<TenantDashboard />} />
        <Route path="/submitcomplaints" element={<Complaints />} />
        <Route path="/submitvisitors" element={<VisitorLogs />} />
        <Route path="/register" element={<TenantRegister />} />
        <Route path="/rental-info" element={<RentalInformation />} />
        <Route path="/rental-agreement" element={<RentalAgreement />} />
        <Route path="/rental-confirmation" element={<RentalConfirmation />} />
        <Route path="/editaccount" element={<EditAccount />} />
        <Route path="/editcomplaints" element={<EditComplaints />} />
        <Route path="/complaint-status" element={<ComplaintStatus />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/forgot-password" element={<TenantFPW />} />
      </Routes>
    </Router>
  );
}

export default App;
