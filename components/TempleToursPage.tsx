import React, { useContext, useState, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { TourPackage } from '../types';
// import { getTourPackages } from '../services/api'; // Assuming this will be created
import { LanguageContext } from '../contexts/LanguageContext';

// Placeholder API call since it's not in the current backend
const getTourPackages = async (): Promise<{data: {data: TourPackage[]}}> => {
    console.warn("getTourPackages is using a placeholder. Please implement in backend.");
    return Promise.resolve({ data: { data: [] } });
}


interface TourPackageCardProps {
    tour: TourPackage;
}

const TourPackageCard: React.FC<TourPackageCardProps> = ({ tour }) => {
    const { t } = useContext(LanguageContext);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <img src={tour.imageUrl} alt={t(tour.nameKey)} className="w-full h-56 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-maroon mb-2">{t(tour.nameKey)}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{t(tour.descriptionKey)}</p>

                <div className="flex justify-between items-center text-maroon border-t border-b border-orange-200 py-3 my-3">
                     <div className="flex items-center gap-2">
                        <Clock size={18} className="text-saffron" />
                        <span className="font-semibold">{t(tour.durationKey)}</span>
                    </div>
                    <div className="text-right">
                         <p className="text-lg font-bold">
                            {t('templeToursPage.priceStartingFrom', { price: tour.price.toLocaleString('en-IN') })}
                        </p>
                    </div>
                </div>
                
                <button 
                    className="mt-4 w-full bg-saffron text-white font-bold py-3 px-4 rounded-full hover:bg-orange-500 transition-colors"
                >
                    {t('common.enquireNow')}
                </button>
            </div>
        </div>
    );
};

interface TempleToursPageProps {
    onBack: () => void;
}

const TempleToursPage: React.FC<TempleToursPageProps> = ({ onBack }) => {
    const { t } = useContext(LanguageContext);
    const [tours, setTours] = useState<TourPackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setIsLoading(true);
                const response = await getTourPackages();
                setTours(response.data.data);
            } catch (error) {
                console.error("Failed to fetch tour packages", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTours();
    }, []);

    return (
        <div className="bg-orange-50/50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-saffron font-semibold hover:underline mb-6"
                >
                    <ArrowLeft size={20} />
                    {t('common.backToHome')}
                </button>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-maroon">{t('templeToursPage.title')}</h1>
                    <p className="text-lg text-gray-600 mt-2">{t('templeToursPage.subtitle')}</p>
                </div>
                {isLoading ? <div className="text-center p-10">Loading tours...</div> :
                 tours.length > 0 ?
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map(tour => (
                            <TourPackageCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                 : <p className="text-center text-gray-500">No tour packages are available at the moment.</p>
                }
            </div>
        </div>
    );
};

export default TempleToursPage;
