import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
                    <span role="img" aria-label="logo">🏛️</span>
                    Bank Academy
                </Link>
                <nav style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/dashboard" style={{ cursor: 'pointer', opacity: 0.9, textDecoration: 'none', color: 'white' }}>Dashboard</Link>
                    <Link to="/my-learning" style={{ cursor: 'pointer', opacity: 0.9, textDecoration: 'none', color: 'white' }}>My Learning</Link>
                    <Link to="/compliance" style={{ cursor: 'pointer', opacity: 0.9, textDecoration: 'none', color: 'white' }}>Compliance</Link>
                </nav>
                <div className="user-profile">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                        JS
                    </div>
                </div>
            </div>
        </header>
    );
}
