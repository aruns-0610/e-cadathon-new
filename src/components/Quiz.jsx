import React, { useState, useEffect } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertTriangle, ClipboardList } from 'lucide-react';
import { supabase } from '../supabase';
import './Quiz.css';
import question3 from "../assets/question-3.png"
import question4 from "../assets/question-4.png"
import question29 from "../assets/question-29.png"
import question28 from "../assets/question-28.png"
import question26 from "../assets/question-26.png"
import question24 from "../assets/question-24.png"
import question22 from "../assets/question-22.png"
import question19 from "../assets/question-19.png"
import question9 from "../assets/question-9.png"
import question8 from "../assets/question-8.png"

function Quiz({ onQuizComplete, user }) {
    const caseStudy = `A student team designed a custom PCB version of their breadboard-based line follower robot, which originally used an Arduino Uno, an L298N motor driver module, two IR reflective sensors (A and B), and a 9V battery. In the PCB redesign, they used the same Arduino Uno footprint, but replaced the IR sensor breakout boards with raw IR LED + photodiode pairs, adding their own resistor networks. The IR emitter LEDs were driven directly from the 5V rail using 220 Ω resistors, while the photodiode outputs formed a voltage divider with 10 kΩ resistors feeding the Arduino ADC pins A0 and A1. The L298N motor driver was powered by the same 9V battery, with a 5V regulator added on the PCB to power Arduino and sensors.
 
During testing, the robot behaved inconsistently: the IR sensors sometimes detected the black line, sometimes didn’t, and occasionally both sensors produced identical readings even though one was directly over white surface. The motors also stuttered during sharp turns, and the Arduino occasionally reset when both motors were commanded full-speed. The team noticed that the photodiode outputs were very noisy on the oscilloscope, with a rapid jumping between 0.4V and 3.8V. Further inspection of the PCB revealed that the IR LED and photodiode were routed next to the motor traces, and the analog ground of sensors was merged with the motor ground at a thin 0.5 mm trace. Additionally, the 5V regulator heated up to nearly 80°C when both motors were active. Their KiCad DRC showed no errors, but ERC warned that the motor supply and logic supply shared unlabeled power nets. The team suspects issues in their resistor values, grounding scheme, trace width, and sensor bias design. They must troubleshoot why the line detection and motor response are unstable, and identify weak design choices in their schematic and PCB routing.`;

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
            answer: "184.8",
            unit: "mW"
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
        {
            id: "17",
            type: "Numerical",
            title: "Consider the circuit shown below:",
            image: question22,
            descr: `At 1kHz frequency, you want the amplitude of output voltage to be ~0.707 times the i/p voltage. 
            To achieve this condition, what value of capacitance can be used? Given R = 11kΩ.`,
            answer: "14.47",
            unit: "×10^-9 F"
        },
        {
            id: "18",
            type: "MCQ",
            title: "Consider the circuit given below",
            image: question19,
            descr: `The GPIO pin is observed to be randomly reading HIGH or LOW. Why?`,
            options: ["Divider ratio wrong", "MCU pin is open-drain", "High impedance, susceptible to noise", "Tolerances mismatched"],
            answer: ""
        },
        {
            id: "19",
            type: "McQ",
            question: `In a microcontroller’s UART part, the Tx and Rx is connected via a 10kΩ series resistor. It is observed that the communication fails intermittently. What is the reason behind this?`,
            options: ["Baud rate too low", "Series resistor too large, thus signal edges slow down",
                "Tx polarity inversed", "Wrong parity configuration"],
            answer: ""
        },
        {
            id: "20",
            type: "McQ",
            question: `Comparator input crosses threshold very slowly due to RC. But output rapidly toggles HIGH/LOW several times. Why this occurs?`,
            options: ["No hysteresis (Schmitt trigger not used)", "Comparator output impedance too high",
                "High input capacitance", "Long wires causing inductive kick"],
            answer: ""
        },
        {
            id: "21",
            type: "MCQ",
            title: "",
            image: question19,
            descr: `Here Vin = 12V, Vout = 5V, Cin = 0.1uF, Cout = 100uF
            The output oscillates at ~20kHz. What is the reason behind this?`,
            options: ["Input side capacitor undervaluedg", "Output capacitor ESR too high", "Load too heavy",
                "LM7805 installed backwards", "Missing small ceramic capacitor on output"],
            answer: ""
        },
        {
            id: "22",
            type: "McQ",
            question: `Output of a non-inverting amplifier saturates at +12V but never reaches -12V, 
            even though supply rails are ±12 V. What is the most likely reason? Given that Rf >> Rin, 
            and Vin is a sine wave of very small amplitude.`,
            options: ["Input offset voltage too high", "Rf is too large",
                "Op-amp has asymmetric output swing capability", "Rin is too small"],
            answer: ""
        },
        {
            id: "23",
            type: "McQ",
            question: `A PCB drives a BLDC motor. During rotor stall, the MOSFETs on the phase-A leg overheat more than phase-B and phase-C.
Which reason is most appropriate?
`,
            options: ["Rotor magnets demagnetized on phase-A only", "Back EMF absent → current spikes concentrated on one leg",
                "Motor coils saturate on only one phase", "Shunt resistor on phase-A has lower tolerance", "Phase-A MOSFET has higher Rds(on) only at low currents"],
            answer: ""
        },
        {
            id: "24",
            type: "McQ",
            question: `A DC motor is powered from a MOSFET-based PWM driver on your PCB. Under load, the motor draws more current and the PCB ground reference fluctuates.
Consider the following statements, and select which combination explains the fluctuating ground reference.
(i)	Increased armature current increases voltage drop across PCB ground traces
(ii)	Motor inductance causes sharp current edges during PWM switching
(iii)	Commutation in the motor introduces additional high-frequency noise
`,
            options: ["(ii) and (iii) only", "(i) and (iii) only",
                "(i), (ii), and (iii)", "(i) and (ii) only"],
            answer: ""
        },
        {
            id: "25",
            type: "McQ",
            question: `12)	Which option(s) correctly describes hazards in combinational logic?
(i)	Static-1 hazard occurs when output should remain 1 but briefly dips to 0
(ii)	Dynamic hazards involve multiple unwanted transitions
(iii)	Hazard-free design always requires adding flip-flops
(iv)	k-map simplification can unintentionally introduce hazards
`,
            options: ["(i) and (ii) only", "(iv) only",
                "(i), (ii), and (iv) only", "(i) only", "(ii) and (iii) only"],
            answer: ""
        },
        {
            id: "26",
            type: "McQ",
            question: `NPN transistor switches a relay. Relay coil has a flyback diode but mounted far at PCB corner, 
            with long thin trace back to transistor. Relay sometimes resets the microcontroller when switching. 
            Which is the BEST explanation?`,
            options: ["Transistor hFE is too low", "MCU reset pin floating",
                "Flyback diode reversed", "Diode too far from the coil"],
            answer: ""
        },
        {
            id: "27",
            type: "MCQ",
            title: "You are given the following target output expression:",
            image: question9,
            descr: `To implement this expression using op-amp building blocks, which of the following configuration sets are valid?
(i)	1 integrator, 1 differentiator, 1 weighted summer
(ii)	2 integrators, 1 differentiator, 1 unit gain follower
(iii)	1 inv-amp, 1 differentiator, 1 weighted summer
(iv)	1 integrator, 1 differentiator, 1 I-V converter
`,
            options: ["(i), (ii), and (iii) only", "(ii) and (iv) only",
                "(i) and (iii) only", "None of these", "(i) only"],
            answer: ""
        },
        {
            id: "28",
            type: "MCQ",
            title: "",
            image: question8,
            descr: `For the given circuit, which set of statements is most accurate and appropriate?
(i)	Increases R, increases the thermal noise contribution
(ii)	Increasing C, shifts the cut-off frequency lower
(iii)	Reducing R, decreases the loading effect on the previous stage
(iv)	Increasing C, improves high-frequency stability in the op-amp stage

`,
            options: ["(i), (ii), and (iii)", "only (ii) and (iv)",
                "(ii), (iii) and (iv)", "only (i) and (ii)", "None of these"],
            answer: ""
        },
        {
            id: "29",
            type: "MCQ",
            title: "Consider the given PCB scenario:",
            image: question8,
            descr: `DRC does not show any error but PCB does not work. If not working, 
            why the ERC/DRC did not show any error?
`,
            options: ["Footprint library outdated", "Pin functions not mapped to electrical types",
                "KiCad cannot detect polarity mismatches", "Symbol pin numbers and footprint pins can differ without DRC flags"],
            answer: ""
        },
        {
            id: "30",
            type: "MCQ",
            title: "Consider the following scenario:",
            image: question3,
            descr: `Which of the following reason(s) best explain(s) the above cause?`,
            options: ["Forward voltage of diode changes rapidly with temperature", "High resistor value makes circuit sensitive to noise pickup",
                "Source supply is unstable", "Diode is damaged"],
            answer: ""
        },
        {
            id: "31",
            type: "MCQ",
            question: `The photodiodes produced noisy voltage readings (0.4V–3.8V). Based on the described PCB behaviour, which is the most likely root cause?`,
            options: ["No pull-up resistors used on the ADC pins", "IR LEDs were underpowered", "Sensor ground shared a long thin trace with motor current return", "Arduino ADC sampling rate was too high"],
            answer: ""
        },
        {
            id: "32",
            type: "MCQ",
            question: `Arduino resets when both motors run at full speed. What parameter did the team most likely miscalculate?`,
            options: ["The dropout voltage of the 7805 regulator", "The required gate charge for the MOSFETs", "The resistor values for the IR LED current", "The ADC resolution (10-bit) mapping"],
            answer: ""
        },
        {
            id: "33",
            type: "MCQ",
            question: `Each IR LED was given a 220 Ω resistor at 5V. Typical IR LED forward voltage is 1.2V and safe current is 20 mA. What LED current did they unknowingly drive?`,
            options: ["8 mA", "12 mA", "17 mA", "25 mA"],
            answer: ""
        },
        {
            id: "34",
            type: "MCQ",
            question: `The IR LED–photodiode pair was routed next to motor traces carrying rapidly switching current. Which effect causes false triggering?`,
            options: ["High output impedance of Arduino pins", "Capacitive and inductive coupling into high-impedance analog node", "Diode reverse recovery noise", "Photodiode saturation at low frequency"],
            answer: ""
        },
        {
            id: "35",
            type: "MCQ",
            question: `ERC showed that logic 5V and motor supply 9V shared unlabeled power nets. Why is this dangerous?`,
            options: ["It prevents ground plane formation", "It creates a possibility of connecting 9V directly to 5V rail", "It stops the board from generating Gerber files", "It forces microcontroller pins to operate at 3.3V"],
            answer: ""
        }

    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisqualified, setIsDisqualified] = useState(false);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    const [showCaseStudy, setShowCaseStudy] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
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
        setShowSubmitConfirm(true);
    };

    const calculateScore = () => {
        let totalScore = 0;

        questions.forEach((q) => {
            const userAnswer = answers[q.id];

            // If question is not answered, skip (score remains 0 for this q)
            if (userAnswer === undefined || userAnswer === null || userAnswer === "") {
                return;
            }

            if (q.type.toLowerCase() === "mcq") {
                // MCQ: +1 for correct, -0.25 for wrong
                if (userAnswer === q.answer) {
                    // console.log(`Q${q.id} Correct. Ans: ${userAnswer}`);
                    totalScore += 1;
                } else {
                    // console.log(`Q${q.id} Wrong. Got: ${userAnswer}, Expected: ${q.answer}`);
                    totalScore -= 0.25;
                }
            } else {
                // Numerical: +2.5 for correct
                const userVal = parseFloat(userAnswer);
                const correctVal = parseFloat(q.answer);

                // Check if valid number
                if (!isNaN(userVal) && !isNaN(correctVal)) {
                    if (Math.abs(userVal - correctVal) < 0.1) { // 0.1 tolerance
                        // console.log(`Q${q.id} Numerical Correct. Got: ${userVal}`);
                        totalScore += 2.5;
                    } else {
                        // console.log(`Q${q.id} Numerical Wrong. Got: ${userVal}, Expected: ${correctVal}`);
                        // No negative marking for numericals? Assuming 0 for now as per previous logic.
                        // If you want negative marking for numericals, uncomment below:
                        // totalScore -= 0.25; 
                    }
                }
            }
        });

        const final = parseFloat(totalScore.toFixed(2));
        console.log("Final Calculated Score:", final);
        return final;
    };

    const handleSubmit = async (forceDisqualified = false) => {
        setShowSubmitConfirm(false); // Close modal if open
        setIsSubmitting(true);
        // Define outside try block to be accessible in setTimeout
        const finalDisqualifiedStatus = forceDisqualified || isDisqualified;

        try {
            const finalScore = calculateScore();

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
        if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
        }

        // Show success message for 2 seconds then complete
        setTimeout(() => {
            onQuizComplete(finalDisqualifiedStatus);
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
                    <AlertTriangle size={64} className="text-red-500 submit-failure-icon" />
                    <h2>You are disqualified</h2>
                    <p>Redirecting to home...</p>
                </div>
            </div>
        )
    }

    // Auto-show/hide Case Study based on question index
    useEffect(() => {
        if (currentQuestionIndex >= 30) {
            setShowCaseStudy(true);
        } else {
            setShowCaseStudy(false);
        }
    }, [currentQuestionIndex]);

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

            {/* Submit Confirmation Modal */}
            {showSubmitConfirm && (
                <div className="fullscreen-warning-overlay">
                    <div className="submit-confirm-modal">
                        <CheckCircle size={48} className="confirm-icon" />
                        <h2>Submit Assessment?</h2>
                        <p className="warning-text">
                            Are you sure you want to submit? You cannot change your answers after submission.
                        </p>
                        <div className="modal-actions">
                            <button className="base-btn cancel-btn" onClick={() => setShowSubmitConfirm(false)}>
                                Cancel
                            </button>
                            <button className="base-btn confirm-submit-btn" onClick={() => handleSubmit()}>
                                Yes, Submit
                            </button>
                        </div>
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
                        <React.Fragment key={q.id}>
                            {i === 30 && (
                                <button
                                    className={`case-study-separator ${currentQuestionIndex >= 30 ? 'active' : ''}`}
                                    onClick={() => handleQuestionSelect(30)}
                                >
                                    Case Study
                                </button>
                            )}
                            <button
                                className={`q-grid-item ${currentQuestionIndex === i ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
                                onClick={() => handleQuestionSelect(i)}
                            >
                                {i + 1}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="quiz-main">
                <div className="quiz-top-bar">
                    <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={28} />
                    </button>

                    {/* Manual Toggle Button (Optional, can keep for user flexibility or hide if auto-only) */}
                    <button className={`case-study-btn ${showCaseStudy ? 'active' : ''}`} onClick={() => setShowCaseStudy(!showCaseStudy)}>
                        <ClipboardList size={20} />
                        <span>Case Study</span>
                    </button>

                    <div className={`timer-display ${isDisqualified ? 'disqualified' : ''}`}>
                        {isDisqualified ? <AlertTriangle size={20} /> : <Clock size={20} />}
                        <span>{isDisqualified ? 'Disqualified' : formatTime(timeLeft)}</span>
                    </div>

                    <button className="primary submit-btn-top" onClick={handleSubmitClick}>
                        Submit
                    </button>
                </div>

                {/* Question Area - Split View Logic */}
                <div className={`question-display-area ${showCaseStudy ? 'split-view' : ''}`}>

                    {/* Left Side (or Full): Question Card */}
                    <div className="single-question-card">
                        <div className="q-header">
                            <span className="q-number">Question {currentQuestionIndex + 1}</span>
                            {/* <span className="q-type">{currentQ.type}</span> */}
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

                    {/* Right Side: Case Study Panel */}
                    {showCaseStudy && (
                        <div className="case-study-panel">
                            <div className="case-study-header-panel">
                                <h2>Case Study</h2>
                                <button className="close-panel-btn" onClick={() => setShowCaseStudy(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="case-study-content-panel">
                                <p>{caseStudy}</p>
                            </div>
                        </div>
                    )}

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
