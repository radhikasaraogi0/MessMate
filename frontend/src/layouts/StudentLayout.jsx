import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export const StudentLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '20px',
          textAlign: 'center',
          fontSize: '0.825rem',
          color: '#64748b',
        }}
      >
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} MessMate &bull; College Hostel Mess Feedback & Management System
        </p>
      </footer>
    </div>
  );
};

export default StudentLayout;
