import React from "react";

function body() {
    const question = [
        {
            type: "McQ",
            question: "Which of the following components is used primarily for storing electric charge?",
            options: [" Resistor", "Inductor", " Capacitor", "Diode"],
            answer: "Capacitor"
        },
        {
            type: "McQ",
            question: `Which of the following statements are TRUE regarding KiCad?

1) KiCad allows generation of a netlist from a schematic.

2) Footprint assignment must be done before PCB layout.

3) KiCad does not support 3D visualization of components.

4) ERC helps detect connection issues in the schematic.
`,
            options: ["1, 2, and 4 only", "1 and 3 only", "2 and 3 only", " All statements 1–4"],
            answer: "1, 2, and 4 only"
        },
        {
            type: "McQ",
            question: `A student designs a PCB where the ground trace is extremely thin and routed across the entire board before reaching the load.
What is the most likely issue this design will cause?`,
            options: [" Higher voltage drop and heating along the ground path", "Signal distortion due to optical interference",
                " Automatic short circuit to VCC", " Board will not pass ERC"],
            answer: " Higher voltage drop and heating along the ground path"
        },
        {
            type: "McQ",
            question: "In a common-emitter BJT amplifier, increasing the emitter resistor RE generally:",
            options: ["Increases gain and decreases stability", " Decreases gain and increases stability",
                " Increases both gain and stability", "Has no effect on gain"],
            answer: "Decreases gain and increases stability"
        },
        {
            type: "McQ",
            question: "In a typical KiCad workflow, which of the following is the correct order?",
            options: ["PCB → Schematic → BOM", "Schematic → Footprint Assignment → PCB Layout",
                "Footprint Assignment → Simulation → Schematic", "Gerber Generation → Routing → Simulation"],
            answer: "Schematic → Footprint Assignment → PCB Layout"
        },
        {
            type: "Numerical",
            question: "A 12 V battery is connected across a 6 Ω resistor. The current flowing through the resistor is:",
            answer: "2"
        },
        {
            type: "McQ",
            question: `Assertion (A): A flyback diode is used across a relay coil in driver circuits.
Reason (R): It protects the driving transistor from high voltage spikes when the coil is switched off.`,
            options: ["A and R are true, and R is the correct explanation of A", "A and R are true, but R is not the correct explanation",
                " A is true, R is false", "A is false, R is true"],
            answer: "A and R are true, and R is the correct explanation of A"
        },
        {
            type: "Numerical",
            question: "A 10 µF capacitor is connected to a 5 V DC supply through a 1 kΩ resistor. What is the time constant (τ)?",
            answer: "0.01"
        },
        {
            type: "McQ",
            question: "Which layer in a PCB defines the electrical connections between components?",
            options: [" Silkscreen layer", "Copper layer", "Mechanical layer", "Solder mask layer"],
            answer: "Copper layer"
        },
        {
            type: "Numerical",
            question: "",
            answer: ""
        }

    ]
    return (
        <>
            <div className="main-div">
                <div className="question-div">
                    {question.map((q, i) => {
                        return (
                            <div key={i}>
                                <p>{q.question}</p>
                                {q.type === "McQ" ? (
                                    <div>
                                        {q.options.map((option, j) => {
                                            return (
                                                <div key={j}>
                                                    <input type="radio" />
                                                    <p>{option}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div>
                                        <input type="number" />

                                    </div>

                                )}

                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default body;