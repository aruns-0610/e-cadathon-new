import React from 'react';
import './EventsSection.css';
import Circuit from "../assets/imagecircuit.png";
import Ev from "../assets/imageev.png";
import Kuka from "../assets/imagekuka.png";
import Quiz from "../assets/imagequiz.png";
import Photo from "../assets/imagephotpo.png";
import Entre from "../assets/imageentre.png"
import AIVideo from "../assets/imagevideo.png"

const EventsSection = () => {
    // Placeholder data for events
    const webURL = "https://impulse-eee-hub.vercel.app/"
    const events = [
        { id: 1, title: "Circuit Debugging", date: "Feb 5, 2026", color: "#3b82f6", image: Circuit },
        { id: 2, title: "Electric Vehicle", date: "Feb 5, 2026", color: "#8b5cf6", image: Ev },
        { id: 3, title: "Kuka Robotics", date: "Feb 5, 2026", color: "#ec4899", image: Kuka },
        { id: 4, title: "Quiz", date: "Feb 5, 2026", color: "#10b981", image: Quiz },
        { id: 5, title: "PhotoGraphy", date: "Feb 5, 2026", color: "#f59e0b", image: Photo },
        { id: 6, title: "StartUp-Pitch", date: "Feb 5, 2026", color: "#f59e0b", image: Entre },
        { id: 7, title: "AI Video Generation", date: "Feb 5, 2026", color: "#f59e0b", image: AIVideo },

    ];

    // Duplicate events for seamless loop (double is sufficient)
    const marqueeEvents = [...events, ...events];

    return (
        <section className="events-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Upcoming <span className="text-highlight">Events</span></h2>
                    <p className="section-desc">Stay updated with the latest happenings in the department.</p>
                </div>
            </div>

            <div className="marquee-container">
                <div className="marquee-content">
                    {marqueeEvents.map((event, index) => (
                        <div
                            key={`${event.id}-${index}`}
                            className="event-card"
                            onClick={() => window.open(webURL, '_blank')}
                        >
                            <img src={event.image} alt={event.title} className="event-image" />
                            <div className="event-overlay">
                                <h3 className="event-title">{event.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventsSection;
