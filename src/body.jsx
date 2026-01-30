import React from "react";

function body() {

    const questionImages = [
        {
        }
    ]
    return (
        <>
            <div className="main-div">
                <div className="question-div">
                    {questions.map((q, i) => {
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
                    { }
                </div>
            </div>
        </>
    )
}

export default body;