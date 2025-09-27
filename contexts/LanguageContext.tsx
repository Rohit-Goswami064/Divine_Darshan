import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { translations } from '../services/translations';

type LanguageContextType = {
    language: string;
    setLanguage: (language: string) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
};

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
    t: () => '',
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
        const langTranslations = translations[language as keyof typeof translations] || translations.en;
        let translation = key.split('.').reduce((obj, key) => obj && obj[key], langTranslations as any) || key;

        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                const regex = new RegExp(`{{${placeholder}}}`, 'g');
                translation = translation.replace(regex, String(replacements[placeholder]));
            });
        }
        
        return translation;
    }, [language]);
    
    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
