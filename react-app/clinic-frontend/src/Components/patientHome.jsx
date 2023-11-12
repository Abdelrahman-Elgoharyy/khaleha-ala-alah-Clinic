import React from "react";
import "./patient.css";
import { Link } from "react-router-dom";

export const PatientHome = () => {
    return(
        <div className="patientHome">
            <div>
      {/* Navigation Bar */}
      

      {/* Profile Side Menu */}
      <div className="profile-menu" id="profileMenu">
        <a href="#">Edit My Profile</a>
        <a href="#">Log Out</a>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-buttons">
            <Link to="/appointments" className="sidebar-button">
                Appointments
            </Link>
            <Link to="/prescriptions" className="sidebar-button">
                Prescriptions
            </Link>
            <Link to="/familyMembers" className="sidebar-button">
                Family Members
            </Link>
            <Link to="/registerFamilyMember" className="sidebar-button">
                 Add Family Members
            </Link>
            <Link to="/searchDoctors" className="sidebar-button">
                 Search Doctors
            </Link>
            <Link to="/viewAllDoctors" className="sidebar-button">
                 View All Doctors
            </Link>


          
        </div>
      </div>
    </div>
        </div>
    );
};