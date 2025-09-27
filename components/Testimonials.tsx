import React, { useRef, useContext, useState, useEffect } from 'react';
import { getTestimonials } from '../services/api';
import { Testimonial } from '../types';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
    return (
        <div className="flex-shrink-0 w-96 bg-white p-8 rounded-xl shadow-lg snap-center">
            <Quote className="text-saffron/50" size={48} />
            <p className="text-gray-700 italic my-4">"{testimonial.quote}"</p>
            <div className="text-right">
                <p className="font-bold text-maroon">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
            </div>
        </div>
    );
}

const Testimonials: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { t } = useContext(LanguageContext);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setIsLoading(true);
                const response = await getTestimonials();
                setTestimonials(response.data.data);
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400; // width of card + gap
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-maroon">{t('testimonials.title')}</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => scroll('left')} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-maroon transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={() => scroll('right')} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-maroon transition-colors">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
                {isLoading ? <div className="text-center p-10">Loading testimonials...</div> : (
                     <div ref={scrollContainerRef} className="flex space-x-8 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {testimonials.map(testimonial => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
