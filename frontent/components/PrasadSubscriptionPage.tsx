import React, { useState, useContext, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AvailablePrasad, Temple } from '../types';
import { getTemples } from '../services/api'; // Changed from mockData
import { LanguageContext } from '../contexts/LanguageContext';
import SubscriptionModal from './SubscriptionModal';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContext } from '../contexts/ToastContext';

interface PrasadCardProps {
    prasad: AvailablePrasad;
    temple: Temple;
    onSubscribe: (prasad: AvailablePrasad, temple: Temple) => void;
}

const PrasadCard: React.FC<PrasadCardProps> = ({ prasad, temple, onSubscribe }) => {
    const { t } = useContext(LanguageContext);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={prasad.imageUrl} alt={t(prasad.nameKey)} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-maroon">{t(prasad.nameKey)}</h3>
                <p className="text-sm text-gray-500 mb-2">{t(temple.nameKey)}</p>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{t(prasad.descriptionKey)}</p>
                
                <div className="grid grid-cols-2 gap-2 text-center mb-4">
                    <div className="bg-orange-100/70 p-2 rounded">
                        <p className="text-xs text-maroon font-semibold">{t('prasadSubscriptionPage.monthly')}</p>
                        <p className="font-bold text-maroon">{t('prasadSubscriptionPage.monthlyPrice', { price: prasad.priceMonthly.toLocaleString('en-IN') })}</p>
                    </div>
                     <div className="bg-orange-100/70 p-2 rounded">
                        <p className="text-xs text-maroon font-semibold">{t('prasadSubscriptionPage.quarterly')}</p>
                        <p className="font-bold text-maroon">{t('prasadSubscriptionPage.quarterlyPrice', { price: prasad.priceQuarterly.toLocaleString('en-IN') })}</p>
                    </div>
                </div>

                <button 
                    onClick={() => onSubscribe(prasad, temple)}
                    className="mt-auto w-full bg-saffron text-white font-bold py-2 px-4 rounded-full hover:bg-orange-500 transition-colors"
                >
                    {t('prasadSubscriptionPage.subscribeNow')}
                </button>
            </div>
        </div>
    );
};


const PrasadSubscriptionPage: React.FC<{ onBack: () => void; onNavigateToDashboard: () => void; }> = ({ onBack, onNavigateToDashboard }) => {
    const { t } = useContext(LanguageContext);
    const { user } = useContext(AuthContext);
    const toastContext = useContext(ToastContext);
    const [modalData, setModalData] = useState<{prasad: AvailablePrasad, temple: Temple} | null>(null);
    const [offerings, setOfferings] = useState<{prasad: AvailablePrasad, temple: Temple}[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOfferings = async () => {
            try {
                setIsLoading(true);
                // The backend doesn't have a dedicated prasad endpoint,
                // so we fetch all temples and extract the prasad offerings.
                const response = await getTemples();
                const allTemples = response.data.data;
                const prasadOfferings = allTemples.flatMap(temple => 
                    (temple.availablePrasads || []).map(prasad => ({ prasad, temple }))
                );
                setOfferings(prasadOfferings);
            } catch (error) {
                console.error("Failed to fetch prasad offerings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOfferings();
    }, []);
    
    const handleSubscribeClick = (prasad: AvailablePrasad, temple: Temple) => {
        if (!user) {
            toastContext?.addToast('Please log in to subscribe.', 'info');
            onNavigateToDashboard(); // This will trigger the login modal
        } else {
            setModalData({ prasad, temple });
        }
    };

    const handleCloseModal = () => {
        setModalData(null);
    };

    return (
        <>
            <div className="bg-orange-50/50 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-saffron font-semibold hover:underline mb-6"
                    >
                        <ArrowLeft size={20} />
                        {t('prasadSubscriptionPage.back')}
                    </button>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-maroon">{t('prasadSubscriptionPage.title')}</h1>
                        <p className="text-lg text-gray-600 mt-2">{t('prasadSubscriptionPage.subtitle')}</p>
                    </div>
                    {isLoading ? <div className="text-center p-10">Loading Prasad...</div> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offerings.map(({ prasad, temple }) => (
                            <PrasadCard key={`${temple.id}-${prasad.id}`} prasad={prasad} temple={temple} onSubscribe={handleSubscribeClick} />
                        ))}
                    </div>
                    }
                </div>
            </div>
            {modalData && user && (
                <SubscriptionModal
                    prasad={modalData.prasad}
                    temple={modalData.temple}
                    user={user}
                    onClose={handleCloseModal}
                    onNavigateToDashboard={onNavigateToDashboard}
                />
            )}
        </>
    );
};

export default PrasadSubscriptionPage;