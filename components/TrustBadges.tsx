import React, { useContext } from 'react';
import { HeartHandshake, ShieldCheck, CheckCircle } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

const Badge: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="text-maroon mb-2">{icon}</div>
        <span className="font-semibold text-gray-700">{text}</span>
    </div>
);

const TrustBadges: React.FC = () => {
    const { t } = useContext(LanguageContext);
    return (
        <section className="py-12 bg-orange-50/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-orange-200">
                    <Badge icon={<HeartHandshake size={40} />} text={t('trustBadges.devotees')} />
                    <Badge icon={<ShieldCheck size={40} />} text={t('trustBadges.payments')} />
                    <Badge icon={<CheckCircle size={40} />} text={t('trustBadges.verified')} />
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;