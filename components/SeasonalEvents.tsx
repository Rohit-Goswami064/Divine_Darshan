import React, { useState, useEffect } from 'react';
import { getSeasonalEvent } from '../services/api';
import { SeasonalEvent } from '../types';

const SeasonalEvents: React.FC = () => {
    const [event, setEvent] = useState<SeasonalEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                const response = await getSeasonalEvent();
                setEvent(response.data.data);
            } catch (error) {
                console.error("Failed to fetch seasonal event:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, []);

    if (isLoading || !event) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-gray-200 rounded-xl shadow-2xl p-8 md:p-16 flex flex-col items-center animate-pulse">
                         <div className="h-9 w-3/4 bg-gray-300 rounded-md mb-4"></div>
                         <div className="h-6 w-1/2 bg-gray-300 rounded-md mb-8"></div>
                         <div className="h-12 w-48 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div 
                    className="bg-cover bg-center rounded-xl shadow-2xl p-8 md:p-16 text-center text-white flex flex-col items-center"
                    style={{ backgroundImage: `linear-gradient(rgba(128, 0, 0, 0.7), rgba(128, 0, 0, 0.7)), url('${event.imageUrl}')` }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h2>
                    <p className="text-lg md:text-xl max-w-2xl mb-8">
                        {event.description}
                    </p>
                    <a 
                        href="#" 
                        className="bg-saffron text-maroon font-bold py-3 px-8 rounded-full text-lg hover:bg-white transition-all duration-300 transform hover:scale-105"
                    >
                        {event.cta}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default SeasonalEvents;
