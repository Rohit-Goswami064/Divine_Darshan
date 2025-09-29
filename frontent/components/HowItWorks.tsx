import React, { useContext } from 'react';
import { MousePointerClick, CreditCard, BellRing } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string; stepNumber: number }> = ({ icon, title, description, stepNumber }) => (
    <div className="relative flex flex-col items-center text-center px-4">
        <div className="relative bg-saffron text-white rounded-full p-6 mb-4 z-10">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-maroon mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);


const HowItWorks: React.FC = () => {
    const { t } = useContext(LanguageContext);
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-maroon">{t('howItWorks.title')}</h2>
                    <p className="text-lg text-gray-600 mt-2">{t('howItWorks.subtitle')}</p>
                </div>
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-8">
                     <div className="absolute top-10 left-0 w-full h-0.5 bg-orange-200 hidden md:block" style={{zIndex: 0}}></div>
                    <Step
                        stepNumber={1}
                        icon={<MousePointerClick size={40} />}
                        title={t('howItWorks.step1.title')}
                        description={t('howItWorks.step1.description')}
                    />
                    <Step
                        stepNumber={2}
                        icon={<CreditCard size={40} />}
                        title={t('howItWorks.step2.title')}
                        description={t('howItWorks.step2.description')}
                    />
                    <Step
                        stepNumber={3}
                        icon={<BellRing size={40} />}
                        title={t('howItWorks.step3.title')}
                        description={t('howItWorks.step3.description')}
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;