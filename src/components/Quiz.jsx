import React, { useState, useEffect } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabase';
import './Quiz.css';
import question3 from "../assets/question-3.png"
import question29 from "../assets/question-29.png"
import question28 from "../assets/question-28.png"
import question26 from "../assets/question-26.png"
import question24 from "../assets/question-24.png"

function Quiz({ onQuizComplete, user }) {
    const questions = [
        {
            id: "1",
            type: "McQ",
            question: "A battery with internal resistance (Ri) is connected across a load resistor (RL). The terminal voltage measured under load drops significantly. Under what condition(s), the stated scenario occurs?",
            options: ["The load resistance (RL) is much greater than the internal resistance (Ri)", "The load resistance (RL) is much less than the internal resistance (Ri) of the battery",
                "The load resistance (RL) is equal to the internal resistance (Ri) of the battery", "The current drawn from the battery decreases due to externally connected resistance"],
            answer: "The load resistance (RL) is much less than the internal resistance (Ri) of the battery"
        },
        {
            id: "2",
            type: "McQ",
            question: `Consider the following equation:
Vo = -(0.0001d(X1)/dt + 2X2), where: X1 = sin(1000πt), X2 = 1.5sin(1000πt)
To obtain the above output voltage expression using op-amps, which of the following configuration(s) can be employed?
(i)	2 integrators, 1 difference amplifier, 1 inverting amplifiers
(ii)	1 differentiator, 1 summing amplifier, 2 inverting amplifiers
(iii)	1 differentiator, 1 weighted summing amplifier, 1 inverting amplifier
(iv)	1 differentiator, 1 weighted summing amplifier, 1 non-inverting amplifier
`,
            options: ["(i) and (iii) only", "only (ii)",
                "only (iv)", "(ii) and (iii) only", "None of these"],
            answer: "(ii) and (iii) only"
        },
        {
            id: "3",
            type: "McQ",
            question: `Consider the following description of a LED driver circuit: An LED → resistor → 9V battery
LED glows bright initially but becomes dim after 5 seconds even though all component values are fixed. Justify the cause of this event.
`,
            options: ["Battery internal resistance increasing with load", "LED forward voltage decreasinge",
                "Ambient light interference", "Resistor heating and increase in its value"],
            answer: "Battery internal resistance increasing with load"
        },
        {
            id: "4",
            type: "McQ",
            question: `You are measuring current using a Hall-effect sensor on a PCB. The output shows slow drifting over time. Choose the best explanation set:
(i)	Magnetic hysteresis in core material
(ii)	Temperature drift in the amplifier inside the sensor
(iii)	Trace carrying measurement signal routed near noisy switching node
(iv)	Sensor saturates only at high-frequency noise peaks`,
            options: ["(i) and (iii) only", "(ii) and (iv) only",
                "(i), (ii) and (iii) only", "(iii) only"],
            answer: "(i), (ii) and (iii) only"
        },
        {
            id: "5",
            type: "McQ",
            question: `A 10 kΩ resistor is connected to a 10 µF capacitor in series. The other end of the capacitor goes to ground. A square-wave source (5 V amplitude, 1 kHz) drives the resistor. 
            On an oscilloscope, instead of a sharp square wave across the capacitor, you see an unusually low peak amplitude and slow charging, 
            even though the RC time constant seems appropriate. Which reason best explains this?`,
            options: ["Capacitor polarity reversed", "Probe connected across the resistor instead of capacitor",
                "Scope input is set to AC coupling", "Duty cycle of square wave is 50%"],
            answer: "Probe connected across the resistor instead of capacitor"
        },
        {
            id: "6",
            type: "Numerical",
            question: "A 12 V battery is connected across a 6 Ω resistor. The current flowing through the resistor is:",
            answer: "2"
        },
        {
            id: "7",
            type: "McQ",
            question: `Assertion (A): In a half-bridge inverter, the PCB layout must minimize the loop area around the switching MOSFETs.
Reason (R): Large loop area increases the probability of shoot-through events.`,
            options: ["A and R are true, and R is the correct explanation of A", "A and R are true, but R is not the correct explanation",
                " A is true, R is false", "Both A and R are false"],
            answer: "A and R are true, and R is the correct explanation of A"
        },
        {
            id: "8",
            type: "Numerical",
            question: `The simulation of a RC circuit shows a capacitor charging through a resistor of resistance 47kΩ. 
            You need the capacitor to reach 75% of its final value within 15ms. What value of capacitance can be chosen?`,
            answer: "0.22",
            unit: "X 10^-6 F"
        },
        {
            id: "9",
            type: "Numerical",
            question: `A voltage divider uses R1 = 82 kΩ and R2 = 18 kΩ to scale 15V down to a lower voltage. 
            The divider output is connected to a sensor whose input resistance is 22 kΩ. 
            What voltage appears   across   the   sensor   input,   considering   the   loading   effect?`,
            answer: "2.3",
            unit: "V"
        },
        {
            id: "10",
            type: "Numerical",
            question: `A MOSFET put under test at switching a 2A load, is observed to have a duty cycle of 60%. 
            Given that Rds(ON) = 77mΩ, evaluate the average conduction loss.`,
            unit: "mW",
            answer: "184.8",
        },
        {
            id: "11",
            type: "MCQ",
            title: "Shown below is the timing diagram of a D-Flip flop",
            image: question3,
            descr: `Which of the following explanation is the most reasonable one for a temporary glitch observed in the output (Q) of the flip flop?
(i)	Setup time violation
(ii)	Hold time violation
(iii)	Propagation delay mismatch in combinational logic feeding the input (D)
(iv)	Faulty clock buffer causing duty cycle distortion
`,
            options: ["only (i) and (iii)", "only (ii) and (iii)", "(i), (ii), (iii), and (iv)", "None of the above"],
            answer: "(i), (ii), (iii), and (iv)"
        },
        {
            id: "12",
            type: "Numerical",
            title: "Consider the circuit shown below:",
            // image: question22, // Image missing in assets
            descr: `At 1kHz frequency, you want the amplitude of output voltage to be ~0.707 times the i/p voltage. 
            To achieve this condition, what value of capacitance can be used? Given R = 11kΩ.`,
            answer: "14.47",
            unit: "×10^-9 F"
        },
        {
            id: "13",
            type: "Numerical",
            title: "Consider the functional block diagram of the 555 timer",
            image: question24,
            descr: `Configured to act as an astable multi-vibrator. 
            Given that, R2 = 3.3kΩ, C1 = 0.1uF, TOFF = 22ms, T = 90ms, determine the value of R1.`,
            answer: "17.4",
            unit: "kΩ"
        },
        {
            id: "14",
            type: "Numerical",
            title: "Consider the following circuit:",
            image: question26,
            descr: `Given that Vin = 2V (peak sine value) at 10kHz, find the minimum slew rate needed (V/µs).`,
            answer: "0.125",
            unit: "V/µs"
        },
        {
            id: "15",
            type: "Numerical",
            title: "Consider the given Full-wave rectifier circuit:",
            image: question28,
            descr: `Given that Vrms = 12V at 100Hz, and RL = 1.1kΩ determine the minimum value of filter 
            capacitance such that ripples <= 0.8V at load current.`,
            answer: "67.5",
            unit: "×10^-6 F"
        },
        {
            id: "16",
            type: "Numerical",
            title: "Consider the following CE-configured BJT transistor.",
            image: question29,
            descr: "Given that IL = 150mA, at the saturation of transistor when VCE = 0.24V, with a supply voltage of 12V, evaluate the load resistance RL.",
            answer: "78.4",
            unit: "Ω"
        },
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

            if (q.type.toLowerCase() === "mcq") {
                // MCQ: +1 for correct, -0.25 for wrong
                if (userAnswer === q.answer) {
                    score += 1;
                } else if (userAnswer) {
                    score -= 0.25;
                }
            } else {
                // Numerical: +2.5 for correct, no negative
                // Simple comparison for now, could benefit from tolerance
                if (userAnswer && parseFloat(userAnswer) === parseFloat(q.answer)) {
                    score += 2.5;
                }
            }
        });

        // score can be negative in this ruleset, but typically we cap floor at 0? 
        // User didn't specify, but code used to return score directly.
        // Assuming raw score is desired.
        return score;
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

    if (isSubmitting && !isDisqualified) {
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
    else if (isSubmitting) {
        return (
            <div className="submission-loading">
                <div className="submission-content">
                    <AlertTriangle size={64} className="submit-failure-icon" />
                    <h2>You are disqualified</h2>
                    <p>Redirecting to home...</p>
                </div>
            </div>
        )
    }

    const handleReturnFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
                .then(() => {
                    setShowFullscreenWarning(false);
                    setIsDisqualified(false);
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
                            key={q.id}
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

                        <div className="q-content-scrollable">
                            {/* 1. Title */}
                            {currentQ.title && <h3 className="q-title">{currentQ.title}</h3>}

                            {/* 2. Image */}
                            {currentQ.image && (
                                <div className="q-image-container">
                                    <img src={currentQ.image} alt="Question Diagram" className="q-image" />
                                </div>
                            )}

                            {/* 3. Description (or Main Text for old Qs) */}
                            {currentQ.question && <p className="q-text">{currentQ.question}</p>}
                            {currentQ.descr && <p className="q-descr">{currentQ.descr}</p>}

                            {/* 4. Options or Input */}
                            <div className="q-options">
                                {currentQ.type.toLowerCase() === "mcq" ? (
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
                                    <div className="numerical-input-wrapper">
                                        <input
                                            type="number"
                                            className="numerical-input-field"
                                            placeholder="Enter answer"
                                            value={answers[currentQ.id] || ''}
                                            onChange={(e) => handleOptionChange(currentQ.id, e.target.value)}
                                            step="any"
                                        />
                                        {currentQ.unit && <span className="unit-label">{currentQ.unit}</span>}
                                    </div>
                                )}
                            </div>
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
