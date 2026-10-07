import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export const StudentLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#111215' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1280px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
      <footer
        style={{
          borderTop: '1px solid #262933',
          backgroundColor: '#16181d',
          padding: '20px',
          textAlign: 'center',
          fontSize: '0.825rem',
          color: '#94a3b8',
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
