import React, { useContext, useState, useEffect } from 'react';
import { getServices } from '../services/api';
import { Service } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';
import { Users, Sparkles, Gift } from 'lucide-react';

const icons: { [key: string]: React.ElementType } = {
    Users,
    Sparkles,
    Gift,
};


const ServiceCard: React.FC<{service: Service}> = ({ service }) => {
    const { t } = useContext(LanguageContext);
    // FIX: Removed unnecessary type assertion `as string` since `service.icon` is now correctly typed as a string.
    const Icon = icons[service.icon] || Users;
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center transition-transform transform hover:-translate-y-2">
            <div className="p-4 bg-maroon text-saffron rounded-full mb-4 inline-block">
                <Icon size={40} />
            </div>
            <h3 className="text-xl font-bold text-maroon mb-2">{t(service.titleKey)}</h3>
            <p className="text-gray-600 mb-4 flex-grow">{t(service.descriptionKey)}</p>
            <a href="#" className="mt-auto font-bold bg-saffron text-white py-2 px-6 rounded-full hover:bg-orange-500 transition-colors">{t('common.bookNow')}</a>
        </div>
    );
};

const ServicesOverview: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                const response = await getServices();
                setServices(response.data.data);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <section className="py-16 bg-orange-50/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-maroon">{t('services.title')}</h2>
                    <p className="text-lg text-gray-600 mt-2">{t('services.subtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                             <div key={i} className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center animate-pulse">
                                <div className="p-4 bg-gray-200 rounded-full mb-4 w-20 h-20"></div>
                                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                                <div className="h-4 w-5/6 bg-gray-200 rounded mb-4"></div>
                                <div className="h-10 w-32 bg-gray-200 rounded-full mt-auto"></div>
                            </div>
                        ))
                    ) : (
                        services.map(service => (
                           <ServiceCard key={service.id} service={service} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ServicesOverview;
