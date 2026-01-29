import React from 'react';
import './WelcomeSection.css';
import { Zap } from 'lucide-react';

const WelcomeSection = () => {
    return (
        <section className="welcome-section">
            <div className="container">
                <div className="welcome-content">
                    <div className="department-badge">
                        <Zap size={16} />
                        <span>Department of EEE</span>
                    </div>
                    <h1 className="hero-title">
                        Welcome to <span className="highlight">E-Cadathon</span>
                    </h1>
                    <p className="hero-subtitle">
                        Unleash your potential in circuit design and electrical engineering.
                        Join the ultimate challenge to test your skills and knowledge.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;
