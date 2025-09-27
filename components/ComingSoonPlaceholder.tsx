import React, { useContext } from 'react';
import { Construction } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface ComingSoonPlaceholderProps {
    title: string;
    description: string;
    onActionClick: () => void;
}

const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({ title, description, onActionClick }) => {
    const { t } = useContext(LanguageContext);
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="p-6 bg-saffron/20 text-saffron rounded-full mb-6">
                <Construction size={48} />
            </div>
            <h2 className="text-3xl font-bold text-maroon mb-2">{title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">{description}</p>
            <h3 className="text-2xl font-bold text-maroon mb-4">{t('comingSoon.title')}</h3>
            <p className="text-gray-600 max-w-xl mb-8">{t('comingSoon.description')}</p>
            <button
                onClick={onActionClick}
                className="bg-saffron text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-105"
            >
                {t('comingSoon.cta')}
            </button>
        </div>
    );
};

export default ComingSoonPlaceholder;