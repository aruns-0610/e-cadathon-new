import React, { useState, useEffect } from 'react';
import { ClipboardList, Play, AlertTriangle, Clock } from 'lucide-react';
import './Instructions.css';

const Instructions = ({ onStartTest, user }) => {
    const [isWithinTimeWindow, setIsWithinTimeWindow] = useState(false);
    const [timeMessage, setTimeMessage] = useState('');

    useEffect(() => {
        const checkTimeWindow = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            // Target date: January 31, 2026
            const isJan31 =
                now.getDate() === 31 &&
                now.getMonth() === 0 && // January is month 0
                now.getFullYear() === 2026;

            // Check if it's Feb 1, 2026 at exactly midnight (00:00)
            const isFeb1Midnight =
                now.getDate() === 1 &&
                now.getMonth() === 1 && // February is month 1
                now.getFullYear() === 2026 &&
                currentHour === 0 &&
                currentMinute === 0;

            // Deadline: Feb 1, 2026 at 00:00:00 (midnight)
            const deadline = new Date(2026, 1, 1, 0, 0, 0); // Feb 1, 2026 00:00:00
            const isAfterDeadline = now >= deadline;

            // Time window: 6 PM Jan 31 to 12:00 AM Feb 1 (midnight)
            const isWithinTime = (isJan31 && currentHour >= 18) || isFeb1Midnight;

            setIsWithinTimeWindow(isWithinTime);

            // Set appropriate message
            if (isAfterDeadline) {
                // After midnight (Feb 1st 00:00 onwards)
                setTimeMessage('The allotted time to start the test is over. For details, contact the organizers.');
            } else if (isJan31 && currentHour < 18) {
                // Jan 31, before 6 PM
                setTimeMessage('Test will be available from 6:00 PM today. Please wait until then.');
            } else if (!isJan31) {
                // Before Jan 31
                setTimeMessage('You can start your test on 31st January 2026 anytime from 6:00 PM to 12:00 AM.');
            }
        };

        checkTimeWindow();
        // Check every minute
        const interval = setInterval(checkTimeWindow, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="instructions-container container">
            <div className="instructions-card">
                <div className="instructions-header">
                    <ClipboardList className="header-icon" size={40} />
                    <h1 className="title">Instructions</h1>
                </div>

                <div className="rules-grid">
                    <div className="rule-item">
                        <span className="bullet-point">•</span>
                        <p>Create an Account and Login (mail Id given in Unstop).</p>
                    </div>
                    <div className="rule-item">
                        <span className="bullet-point">•</span>
                        <p>Test should be attempted in fullscreen mode only.</p>
                    </div>
                    <div className="rule-item">
                        <span className="bullet-point">•</span>
                        <p>Do not switch tabs or minimize the browser window to avoid Disqualification.</p>
                    </div>
                    <div className="rule-item">
                        <span className="bullet-point">•</span>
                        <p>Total duration is 90 minutes. Timer starts immediately after clicking "Start Test".</p>
                    </div>
                    <div className="rule-item">
                        <span className="bullet-point">•</span>
                        <p>The test consists of Multiple Choice Questions (MCQ) and Numerical Answer type questions.</p>
                    </div>
                    <div className="rule-item" style={{ fontWeight: "650" }}>
                        <span className="bullet-point">•</span>
                        <p>Correct answers award +1 marks(MCQ). Incorrect MCQs have -0.25 marks penalty.</p>
                    </div>
                    <div className="rule-item" style={{ fontWeight: "650" }}>
                        <span className="bullet-point">•</span>
                        <p>Correct answers award +2.5 marks(Numerical). No negative marks for Numerical type.</p>
                    </div>
                    <div className="rule-item">
                        <span className="bullet-point">•</span>
                        <p style={{ textTransform: "uppercase" }}>Test Will be Submitted Automatically after the alotted time is over.</p>
                    </div>
                    <div className="rule-item">
                        <span className="bullet-point">•</span>
                        <p>Teams will be shortlisted based on the total marks obtained.</p>
                    </div>
                    <div className="rule-item">
                        <span className="bullet-point">•</span>
                        <p>For more details contact the organizers.</p>
                    </div>
                </div>

                <div className="action-area">
                    {user?.email === "arun6.10.2006@gmail.com" ? (
                        // Admin override - always show start button
                        <button className="primary start-btn" onClick={onStartTest}>
                            <Play size={20} />
                            <span>Start Test</span>
                        </button>
                    ) : user ? (
                        // Logged in user - check time window
                        isWithinTimeWindow ? (
                            <button className="primary start-btn" onClick={onStartTest}>
                                <Play size={20} />
                                <span>Start Test</span>
                            </button>
                        ) : (
                            <div className="login-prompt time-restriction">
                                <div style={{ marginTop: "3px" }}>
                                    <Clock className="text-yellow" size={20} />
                                </div>
                                <p>{timeMessage}</p>
                            </div>
                        )
                    ) : (
                        // Not logged in
                        <div className="login-prompt">
                            <div style={{ marginTop: "3px" }}>
                                <AlertTriangle className="text-yellow" size={20} />
                            </div>
                            <p>You can start your test on 31st January 2026 anytime from 6:00 PM to 12:00 AM.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Instructions;
