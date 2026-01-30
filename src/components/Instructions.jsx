import React from 'react';
import { ClipboardList, Play, AlertTriangle } from 'lucide-react';
import './Instructions.css';

const Instructions = ({ onStartTest, user }) => {
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
                        <p>Test Will be Submitted Automatically after time over.</p>
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
                        <button className="primary start-btn" onClick={onStartTest}>
                            <Play size={20} />
                            <span>Start Test</span>
                        </button>
                        // <div></div>
                    ) : (

                        <div className="login-prompt">
                            <AlertTriangle className="text-yellow" size={20} />
                            <p>You can Start Your test on 31st January 2026 anytime from 6:00 PM to 10:00 PM.</p>
                        </div>

                    )}



                </div>
            </div>
        </div>
    );
};

export default Instructions;
