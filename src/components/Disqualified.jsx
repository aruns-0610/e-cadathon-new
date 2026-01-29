import React from 'react';
import { XCircle } from 'lucide-react';
import './TestCompleted.css';

const Disqualified = () => {
    return (
        <div className="test-completed-container container">
            <div className="completed-card disqualified-card">
                <XCircle className="disqualified-icon" size={64} />
                <h1 className="completed-title">Disqualified</h1>
                <p className="completed-message">
                    You have been disqualified from this test due to violation of test rules.
                </p>
                <div className="completed-info">
                    <p>Switching tabs or minimizing the browser window during the test is not allowed.</p>
                    <p className="highlight-text">Please contact the organizers if you believe this is an error.</p>
                </div>
            </div>
        </div>
    );
};

export default Disqualified;
