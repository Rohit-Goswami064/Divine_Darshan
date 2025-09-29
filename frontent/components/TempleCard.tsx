import React, { useContext } from 'react';
import { Temple } from '../types';
import { MapPin } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

const TempleCard: React.FC<{ temple: Temple; onSelect: (temple: Temple) => void }> = ({ temple, onSelect }) => {
    const { t } = useContext(LanguageContext);
    return (
        <div 
            onClick={() => onSelect(temple)}
            className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
        >
            <img src={temple.imageUrl} alt={t(temple.nameKey)} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-maroon">{t(temple.nameKey)}</h3>
                <p className="text-gray-600 flex items-center mt-1">
                    <MapPin size={16} className="mr-2 text-gray-500" />
                    {t(temple.locationKey)}
                </p>
                <div className="mt-4 flex-grow">
                    <p className="text-sm"><span className="font-semibold">{t('templeCard.deity')}:</span> {t(temple.deityKey)}</p>
                    <p className="text-sm"><span className="font-semibold">{t('templeCard.famousPuja')}:</span> {t(temple.famousPujaKey)}</p>
                </div>
                <button className="mt-4 w-full bg-saffron text-white font-bold py-2 px-4 rounded-full hover:bg-orange-500 transition-colors">
                    {t('templeCard.viewServices')}
                </button>
            </div>
        </div>
    );
};

export default TempleCard;
