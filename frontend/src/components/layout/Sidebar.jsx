import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareText,
  UtensilsCrossed,
  BarChart3,
  Users,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/admin/dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { to: '/admin/feedback', label: 'Feedback Logs', icon: MessageSquareText },
    { to: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed },
    { to: '/admin/analytics', label: 'Visual Analytics', icon: BarChart3 },
    { to: '/admin/students', label: 'Student Directory', icon: Users },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#16181d',
        borderRight: '1px solid #232731',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 68px)',
        position: 'sticky',
        top: '68px',
        flexShrink: 0,
      }}
      className="admin-sidebar"
    >
      {/* Admin Panel Badge */}
      <div
        style={{
          padding: '20px 20px 14px 20px',
          borderBottom: '1px solid #232731',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#c4b5fd',
            color: '#0f1013',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
          }}
        >
          <ShieldCheck size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#f8fafc' }}>
            Admin Console
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Hostel Mess Authority
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav
        style={{
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#0f1013' : '#94a3b8',
                backgroundColor: isActive ? '#fef08a' : 'transparent',
                transition: 'all 0.15s ease',
              })}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Mess System Status Badge */}
      <div
        style={{
          margin: '16px',
          padding: '14px',
          borderRadius: '12px',
          backgroundColor: '#1b1d24',
          border: '1px solid #282c37',
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#bbf7d0',
              display: 'inline-block',
              boxShadow: '0 0 8px #bbf7d0',
            }}
          />
          <span style={{ fontWeight: '700', color: '#f8fafc' }}>Live System</span>
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
          Real-time aggregations active
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
