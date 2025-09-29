import React, { useContext, useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Sparkles } from 'lucide-react';
import { SpecialSeva } from '../types';
// import { getSpecialSevas } from '../services/api'; // Assuming this will be created
import { LanguageContext } from '../contexts/LanguageContext';


// Placeholder API call since it's not in the current backend
const getSpecialSevas = async (): Promise<{data: {data: SpecialSeva[]}}> => {
    console.warn("getSpecialSevas is using a placeholder. Please implement in backend.");
    return Promise.resolve({ data: { data: [] } });
}

interface SpecialSevaCardProps {
    seva: SpecialSeva;
}

const SpecialSevaCard: React.FC<SpecialSevaCardProps> = ({ seva }) => {
    const { t } = useContext(LanguageContext);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <img src={seva.imageUrl} alt={t(seva.nameKey)} className="w-full md:w-1/3 h-64 md:h-auto object-cover" />
            <div className="p-6 flex flex-col flex-grow">
                <div>
                    <h3 className="text-2xl font-bold text-maroon">{t(seva.nameKey)}</h3>
                    <p className="text-gray-500 flex items-center text-sm mt-1 mb-3">
                        <MapPin size={14} className="mr-1.5" />
                        {t(seva.templeNameKey)}
                    </p>
                    <p className="text-gray-700 text-sm mb-4">{t(seva.descriptionKey)}</p>
                </div>
                
                <div className="bg-orange-100/70 p-4 rounded-lg mt-auto">
                     <h4 className="font-semibold text-maroon mb-2 flex items-center gap-2">
                        <Sparkles size={18} className="text-saffron" />
                        {t('specialSevaPage.benefits')}
                    </h4>
                    <p className="text-sm text-gray-800">{t(seva.benefitsKey)}</p>
                </div>

                <div className="flex justify-between items-center mt-6">
                     <p className="text-2xl font-bold text-maroon">
                        ₹{seva.price.toLocaleString('en-IN')}
                    </p>
                    <button 
                        className="bg-saffron text-white font-bold py-2 px-6 rounded-full hover:bg-orange-500 transition-colors"
                    >
                        {t('common.bookNow')}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SpecialSevaPageProps {
    onBack: () => void;
}

const SpecialSevaPage: React.FC<SpecialSevaPageProps> = ({ onBack }) => {
    const { t } = useContext(LanguageContext);
    const [sevas, setSevas] = useState<SpecialSeva[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSevas = async () => {
            try {
                setIsLoading(true);
                const response = await getSpecialSevas();
                setSevas(response.data.data);
            } catch (error) {
                console.error("Failed to fetch sevas", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSevas();
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
                    <h1 className="text-4xl font-bold text-maroon">{t('specialSevaPage.title')}</h1>
                    <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">{t('specialSevaPage.subtitle')}</p>
                </div>
                {isLoading ? <div className="text-center p-10">Loading Sevas...</div> :
                sevas.length > 0 ?
                <div className="max-w-4xl mx-auto space-y-8">
                    {sevas.map(seva => (
                        <SpecialSevaCard key={seva.id} seva={seva} />
                    ))}
                </div>
                : <p className="text-center text-gray-500">No special sevas are available at the moment.</p>
                }
            </div>
        </div>
    );
};

export default SpecialSevaPage;
