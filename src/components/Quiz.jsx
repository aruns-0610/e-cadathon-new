import React, { useState, useEffect } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabase';
import './Quiz.css';

function Quiz({ onQuizComplete, user }) {
    const questions = [
        {
            type: "McQ",
            question: "Which of the following components is used primarily for storing electric charge?",
            options: ["Resistor", "Inductor", "Capacitor", "Diode"],
            correctAnswer: "Capacitor",
            id: 1
        },
        {
            type: "McQ",
            question: `Which of the following statements are TRUE regarding KiCad?

1) KiCad allows generation of a netlist from a schematic.
2) Footprint assignment must be done before PCB layout.
3) KiCad does not support 3D visualization of components.
4) ERC helps detect connection issues in the schematic.`,
            options: ["1, 2, and 4 only", "1 and 3 only", "2 and 3 only", "All statements 1–4"],
            correctAnswer: "1, 2, and 4 only",
            id: 2
        },
        {
            type: "McQ",
            question: `A student designs a PCB where the ground trace is extremely thin and routed across the entire board before reaching the load.
What is the most likely issue this design will cause?`,
            options: ["Higher voltage drop and heating along the ground path", "Signal distortion due to optical interference",
                "Automatic short circuit to VCC", "Board will not pass ERC"],
            correctAnswer: "Higher voltage drop and heating along the ground path",
            id: 3
        },
        {
            type: "McQ",
            question: "In a common-emitter BJT amplifier, increasing the emitter resistor RE generally:",
            options: ["Increases gain and decreases stability", "Decreases gain and increases stability",
                "Increases both gain and stability", "Has no effect on gain"],
            correctAnswer: "Decreases gain and increases stability",
            id: 4
        },
        {
            type: "McQ",
            question: "In a typical KiCad workflow, which of the following is the correct order?",
            options: ["PCB → Schematic → BOM", "Schematic → Footprint Assignment → PCB Layout",
                "Footprint Assignment → Simulation → Schematic", "Gerber Generation → Routing → Simulation"],
            correctAnswer: "Schematic → Footprint Assignment → PCB Layout",
            id: 5
        },
        {
            type: "Numerical",
            question: "A 12 V battery is connected across a 6 Ω resistor. The current flowing through the resistor is:",
            correctAnswer: 2,
            id: 6
        },
        {
            type: "McQ",
            question: `Assertion (A): A flyback diode is used across a relay coil in driver circuits.
Reason (R): It protects the driving transistor from high voltage spikes when the coil is switched off.`,
            options: ["A and R are true, and R is the correct explanation of A", "A and R are true, but R is not the correct explanation",
                "A is true, R is false", "A is false, R is true"],
            correctAnswer: "A and R are true, and R is the correct explanation of A",
            id: 7
        },
        {
            type: "Numerical",
            question: "A 10 µF capacitor is connected to a 5 V DC supply through a 1 kΩ resistor. What is the time constant (τ)?",
            correctAnswer: 0.01,
            id: 8
        },
        {
            type: "McQ",
            question: "Which layer in a PCB defines the electrical connections between components?",
            options: ["Silkscreen layer", "Copper layer", "Mechanical layer", "Solder mask layer"],
            correctAnswer: "Copper layer",
            id: 9
        },
        {
            type: "Numerical",
            question: "Enter the value of Pi to two decimal places.",
            correctAnswer: 3.14,
            id: 10
        }
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisqualified, setIsDisqualified] = useState(false);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    const [fullscreenExitCount, setFullscreenExitCount] = useState(0);

    // Track visibility changes for disqualification
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsDisqualified(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Track fullscreen exit
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !isSubmitting) {
                setFullscreenExitCount(prev => {
                    const newCount = prev + 1;

                    if (newCount >= 2) {
                        // Second exit - auto submit with disqualification
                        setIsDisqualified(true);
                        handleSubmit(true); // Pass true to force disqualified status
                    } else {
                        // First exit - show warning
                        setShowFullscreenWarning(true);
                        setIsDisqualified(true);
                    }

                    return newCount;
                });
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [isSubmitting]);

    // Timer Effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleQuestionSelect = (index) => {
        setCurrentQuestionIndex(index);
        setIsSidebarOpen(false); // Close sidebar on select
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitClick = () => {
        if (window.confirm("Are you sure you want to submit the assessment?")) {
            handleSubmit();
        }
    };

    const calculateScore = () => {
        let score = 0;

        questions.forEach((q) => {
            const userAnswer = answers[q.id];

            if (q.type === "McQ") {
                // MCQ: +1 for correct, -0.25 for wrong
                if (userAnswer === q.correctAnswer) {
                    score += 1;
                } else if (userAnswer) {
                    score -= 0.25;
                }
            } else {
                // Numerical: +2.5 for correct, no negative
                if (userAnswer && parseFloat(userAnswer) === q.correctAnswer) {
                    score += 2.5;
                }
            }
        });

        return Math.max(0, score); // Ensure score is not negative
    };

    const handleSubmit = async (forceDisqualified = false) => {
        setIsSubmitting(true);

        try {
            const finalScore = calculateScore();
            const finalDisqualifiedStatus = forceDisqualified || isDisqualified;

            // Insert test results to Supabase
            const { error } = await supabase
                .from('test_results')
                .insert({
                    email: user?.email || 'anonymous@test.com',
                    score: finalScore,
                    is_disqualified: finalDisqualifiedStatus,
                    is_submitted: true
                });

            if (error) {
                console.error('Error saving test results:', error);
            }
        } catch (err) {
            console.error('Submission error:', err);
        }

        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.log(err));
        }

        // Show success message for 2 seconds then complete
        setTimeout(() => {
            onQuizComplete();
        }, 2000);
    };

    if (isSubmitting) {
        return (
            <div className="submission-loading">
                <div className="submission-content">
                    <CheckCircle size={64} className="submit-success-icon" />
                    <h2>Test Submitted Successfully</h2>
                    <p>Redirecting to home...</p>
                </div>
            </div>
        );
    }

    const handleReturnFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
                .then(() => {
                    setShowFullscreenWarning(false);
                })
                .catch(err => console.log(err));
        }
    };

    const currentQ = questions[currentQuestionIndex];

    return (
        <div className="quiz-container-fullscreen">
            {/* Fullscreen Warning Modal */}
            {showFullscreenWarning && (
                <div className="fullscreen-warning-overlay">
                    <div className="fullscreen-warning-modal">
                        <AlertTriangle size={48} className="warning-icon" />
                        <h2>Fullscreen Mode Required</h2>
                        <p className="warning-text">
                            Don't exit fullscreen mode! You will be disqualified from the round.
                        </p>
                        <p className="warning-subtext">
                            You have exited {fullscreenExitCount} time(s). One more exit will result in automatic submission and disqualification.
                        </p>
                        <button className="primary fullscreen-return-btn" onClick={handleReturnFullscreen}>
                            Return to Fullscreen Mode
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className={`quiz-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Questions</h3>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <div className="question-grid">
                    {questions.map((q, i) => (
                        <button
                            key={i}
                            className={`q-grid-item ${currentQuestionIndex === i ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
                            onClick={() => handleQuestionSelect(i)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="quiz-main">
                <div className="quiz-top-bar">
                    <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={28} />
                    </button>

                    <div className={`timer-display ${isDisqualified ? 'disqualified' : ''}`}>
                        {isDisqualified ? <AlertTriangle size={20} /> : <Clock size={20} />}
                        <span>{isDisqualified ? 'Disqualified' : formatTime(timeLeft)}</span>
                    </div>

                    <button className="primary submit-btn-top" onClick={handleSubmitClick}>
                        Submit
                    </button>
                </div>

                <div className="question-display-area">
                    <div className="single-question-card">
                        <div className="q-header">
                            <span className="q-number">Question {currentQuestionIndex + 1}</span>
                            <span className="q-type">{currentQ.type}</span>
                        </div>

                        <p className="q-text">{currentQ.question}</p>

                        <div className="q-options">
                            {currentQ.type === "McQ" ? (
                                <div className="options-list">
                                    {currentQ.options.map((option, j) => (
                                        <label key={j} className={`option-item ${answers[currentQ.id] === option ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name={`q-${currentQ.id}`}
                                                value={option}
                                                checked={answers[currentQ.id] === option}
                                                onChange={() => handleOptionChange(currentQ.id, option)}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    className="numerical-input-field"
                                    placeholder="Enter numerical answer"
                                    value={answers[currentQ.id] || ''}
                                    onChange={(e) => handleOptionChange(currentQ.id, e.target.value)}
                                    step="any"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="quiz-controls">
                    <button
                        className="control-btn prev"
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    <button
                        className="control-btn next"
                        onClick={handleNext}
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Next
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Overlay for sidebar */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
        </div>
    );
}

export default Quiz;
