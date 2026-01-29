import React from 'react';
import { CheckCircle } from 'lucide-react';
import './TestCompleted.css';

const TestCompleted = () => {
    return (
        <div className="test-completed-container container">
            <div className="completed-card">
                <CheckCircle className="success-icon" size={64} />
                <h1 className="completed-title">Your test is completed successfully</h1>
                <p className="completed-message">
                    Thank you for taking part in the quiz. The session successfully completed.
                </p>
                <div className="completed-info">
                    <p>Further details regarding results and next steps will be communicated by the organizers.</p>
                    <p className="highlight-text">Until then, explore other opportunities and events!</p>
                </div>
            </div>
        </div>
    );
};

export default TestCompleted;
