import React, { useContext } from 'react';
import { Search, Ticket, Sparkles, Gift, Users, Bus, Star } from 'lucide-react';
import { QuickAction } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';

const quickActions: QuickAction[] = [
    { id: 1, labelKey: 'quickActions.darshan', icon: Ticket },
    { id: 2, labelKey: 'quickActions.epuja', icon: Sparkles },
    { id: 3, labelKey: 'quickActions.prasad', icon: Gift },
    { id: 4, labelKey: 'quickActions.queue', icon: Users },
    { id: 5, labelKey: 'quickActions.tours', icon: Bus },
    { id: 6, labelKey: 'quickActions.seva', icon: Star },
];

interface QuickActionButtonProps {
    action: QuickAction;
    onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ action, onClick }) => {
    const { t } = useContext(LanguageContext);
    const Icon = action.icon;
    const buttonClasses = "group flex flex-col items-center justify-center text-center p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 w-full h-full hover:shadow-xl hover:-translate-y-1 cursor-pointer";

    return (
        <button onClick={onClick} className={buttonClasses}>
            <div className="bg-saffron text-white p-4 rounded-full mb-3">
                <Icon size={32} />
            </div>
            <span className="font-semibold text-maroon text-sm md:text-base">{t(action.labelKey)}</span>
        </button>
    );
};

interface HeroProps {
    onBookDarshan: () => void;
    onBookEPuja: () => void;
    onPrasadSubscription: () => void;
    onQueueAssistance: () => void;
    onTempleTours: () => void;
    onSpecialSeva: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookDarshan, onBookEPuja, onPrasadSubscription, onQueueAssistance, onTempleTours, onSpecialSeva }) => {
    const { t } = useContext(LanguageContext);
    
    const getActionHandler = (actionId: number): (() => void) => {
        switch (actionId) {
            case 1: return onBookDarshan;
            case 2: return onBookEPuja;
            case 3: return onPrasadSubscription;
            case 4: return onQueueAssistance;
            case 5: return onTempleTours;
            case 6: return onSpecialSeva;
            default: return () => console.warn('Unknown action');
        }
    };

    return (
        <section className="relative bg-cover bg-center py-20 md:py-32" style={{ backgroundImage: `url('https://th.bing.com/th/id/R.7a597d5c26d6c80c9a1770de2935dde6?rik=elpdFrOmUN3pRw&riu=http%3a%2f%2fwww.thehistoryhub.com%2fwp-content%2fuploads%2f2017%2f03%2fKashi-Vishwanath-Temple.jpg&ehk=uLF1dzVIUhTZ7QxBw5uhz06SVzeEBNCdQf1puUHIe3E%3d&risl=&pid=ImgRaw&r=0')` }}>
            <div className="absolute inset-0 bg-maroon bg-opacity-60"></div>
            <div className="relative container mx-auto px-4 z-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('hero.title')}</h1>
                <p className="text-lg md:text-xl text-white/90 mb-8">{t('hero.subtitle')}</p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('hero.searchPlaceholder')}
                            className="w-full p-4 pl-12 rounded-full text-lg text-gray-800 shadow-inner focus:outline-none focus:ring-4 focus:ring-saffron/50"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {quickActions.map(action => (
                        <QuickActionButton 
                            key={action.id} 
                            action={action}
                            onClick={getActionHandler(action.id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
