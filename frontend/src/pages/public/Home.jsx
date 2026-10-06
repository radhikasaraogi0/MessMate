import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import {
  UtensilsCrossed,
  Star,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Users,
  CheckCircle,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Home = () => {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
          padding: '80px 20px 100px 20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '920px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              padding: '6px 16px',
              borderRadius: '9999px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
              marginBottom: '24px',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#ea580c',
            }}
          >
            <Sparkles size={16} />
            <span>Digital Mess Management & Real-Time Student Feedback</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <Logo size="lg" showTagline={false} />
          </div>

          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
              fontWeight: '800',
              color: '#0f172a',
              lineHeight: 1.15,
              margin: '0 0 20px 0',
              letterSpacing: '-0.03em',
            }}
          >
            Better Campus Meals With <br />
            <span style={{ color: '#ea580c' }}>Your Mess Dining Companion</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 36px auto',
            }}
          >
            MessMate bridges the communication gap between university hostel residents and mess authorities.
            Track daily menus, rate meal quality across 4 critical pillars, report food issues instantly, and inspect data-driven insights.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ea580c',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 10px 15px -3px rgba(234, 88, 12, 0.35)',
                transition: 'transform 0.15s ease, background-color 0.15s ease',
              }}
            >
              <span>Explore Portal / Login</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                textDecoration: 'none',
                border: '1px solid #cbd5e1',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              }}
            >
              <span>Student Registration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Quick-Access Card */}
      <section style={{ maxWidth: '1100px', margin: '-40px auto 60px auto', padding: '0 20px', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            padding: '28px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Student Access */}
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff7ed',
              borderRadius: '14px',
              border: '1px solid #fed7aa',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Users size={20} color="#ea580c" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#9a3412' }}>
                Student Demo Account
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 12px 0' }}>
              Check today’s menu, rate meals with 4-pillar ratings, and track your history.
            </p>
            <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#1e293b', marginBottom: '14px' }}>
              <strong>Email:</strong> rahul@messmate.edu<br />
              <strong>Password:</strong> Student@123
            </div>
            <Link
              to="/login?role=student"
              style={{
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#ea580c',
                color: '#ffffff',
                padding: '9px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              Sign In as Student
            </Link>
          </div>

          {/* Admin Access */}
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f5f3ff',
              borderRadius: '14px',
              border: '1px solid #ddd6fe',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={20} color="#7c3aed" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#5b21b6' }}>
                Admin Demo Account
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 12px 0' }}>
              View live Recharts analytics, manage menus, filter student feedback & issues.
            </p>
            <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#1e293b', marginBottom: '14px' }}>
              <strong>Email:</strong> admin@messmate.edu<br />
              <strong>Password:</strong> Admin@123
            </div>
            <Link
              to="/login?role=admin"
              style={{
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                padding: '9px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              Sign In as Admin
            </Link>
          </div>

          {/* New Mess Authority Registration */}
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f0f9ff',
              borderRadius: '14px',
              border: '1px solid #bae6fd',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <UtensilsCrossed size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0369a1' }}>
                Multi-Mess Onboarding
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 12px 0' }}>
              Register $N$ independent hostel mess facilities across campus zones.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#1e293b', marginBottom: '14px', lineHeight: 1.45 }}>
              ⚡ <strong>Multi-Tenant:</strong> Isolated menus, student rosters, feedback & charts.
            </div>
            <Link
              to="/register?tab=mess"
              style={{
                display: 'block',
                textAlign: 'center',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                padding: '9px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              Register New Mess
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '2rem',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 12px 0',
            }}
          >
            Engineered for Campus Mess Excellence
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            A comprehensive feedback and analytics loop providing full transparency for students and actionable metrics for mess supervisors.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#ffedd5',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Star size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
              4-Pillar Rating Scale
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Students rate every meal specifically across Taste, Food Quality, Hygiene, and Quantity with granular precision.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
              Daily & Weekly Menus
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Check Breakfast, Lunch, Evening Snacks, and Dinner menus ahead of time with live average rating tags.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#f3e8ff',
                color: '#7e22ce',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
              Dynamic Recharts
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Automated MongoDB aggregation powers live 7-day rating trend lines, meal comparisons, and complaint analytics.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
              Actionable Issue Tags
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Tag issues instantly: "Too spicy", "Too salty", "Food was cold", "Too oily", or "Less quantity" for rapid kitchen fixes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          padding: '40px 20px 30px 20px',
          textAlign: 'center',
          fontSize: '0.875rem',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Logo size="md" isDark={true} />
          </div>
          <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>
            Empowering college hostel students with a transparent, responsive dining feedback ecosystem.
          </p>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} MessMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
