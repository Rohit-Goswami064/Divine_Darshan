import React, { useRef, useContext, useState, useEffect } from 'react';
import { getTemples } from '../services/api';
import { Temple } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import TempleCard from './TempleCard';

const FeaturedTemples: React.FC<{onSelectTemple: (temple: Temple) => void}> = ({ onSelectTemple }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { t } = useContext(LanguageContext);
    const [temples, setTemples] = useState<Temple[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedTemples = async () => {
            try {
                setIsLoading(true);
                const response = await getTemples();
                setTemples(response.data.data.slice(0, 6)); // Show first 6 as featured
            } catch (error) {
                console.error("Failed to fetch temples:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeaturedTemples();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -340 : 340;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-maroon">{t('featuredTemples.title')}</h2>
                     <div className="flex items-center space-x-2">
                        <button onClick={() => scroll('left')} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-maroon transition-colors" aria-label="Scroll left">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={() => scroll('right')} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-maroon transition-colors" aria-label="Scroll right">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
                {isLoading ? (
                     <div className="text-center p-10 text-gray-500">Loading temples...</div>
                ) : (
                    <div ref={scrollContainerRef} className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {temples.map(temple => (
                            <div key={temple.id} className="flex-shrink-0 w-80 snap-center">
                               <TempleCard temple={temple} onSelect={onSelectTemple} />
                            </div>
                        ))}
                    </div>
                )}
                 <div className="text-center mt-8">
                    <a href="#" className="text-saffron font-semibold hover:underline">{t('featuredTemples.seeAll')} &rarr;</a>
                </div>
            </div>
        </section>
    );
};

export default FeaturedTemples;
