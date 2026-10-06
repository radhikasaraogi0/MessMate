import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

export const AdminLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            padding: '28px 32px',
            maxWidth: '1440px',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          }}
          className="admin-main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
