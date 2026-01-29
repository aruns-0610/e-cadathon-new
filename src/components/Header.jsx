import React, { useState, useEffect, useRef } from 'react';
import { User, LogIn, LogOut, CircuitBoard } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLoginClick, onLogoutClick }) => {
    const [showProfileDetails, setShowProfileDetails] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // If menu is open AND click is NOT on the button AND click is NOT inside the dropdown
            if (
                showProfileDetails &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowProfileDetails(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDetails]);

    return (
        <header className="app-header">
            <div className="header-content container">
                <div className="brand">
                    <CircuitBoard className="brand-icon" size={32} />
                    <span className="brand-text">E-Cadathon</span>
                </div>

                <div className="auth-section">
                    {user ? (
                        <div className="user-profile-container">
                            <button
                                ref={buttonRef}
                                className="profile-btn"
                                onClick={() => setShowProfileDetails(!showProfileDetails)}
                            >
                                <User size={20} />
                                <span className="user-name-short">{user.name}</span>
                            </button>

                            {showProfileDetails && (
                                <div ref={dropdownRef} className="profile-dropdown">
                                    <div className="dropdown-item">
                                        <strong>{user.name}</strong>
                                    </div>
                                    <div className="dropdown-item email">
                                        {user.email}
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <button className="dropdown-item logout-btn" onClick={onLogoutClick}>
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="primary login-btn" onClick={onLoginClick}>
                                <LogIn size={18} />
                                <span>Login / Signup</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
