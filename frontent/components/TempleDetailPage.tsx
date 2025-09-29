import React, { useState, useContext, useEffect, useRef } from 'react';
import { Temple, Puja, Testimonial } from '../types';
import { ArrowLeft, MapPin, Sparkles, Info, HeartHandshake, ShieldCheck, Star, ChevronDown, CheckCircle, Quote, BookMarked, Award } from 'lucide-react';
import BookingModal from './BookingModal';
import { LanguageContext } from '../contexts/LanguageContext';
import { getTempleById, getTestimonials } from '../services/api';

// --- PROPS INTERFACE ---
interface TempleDetailPageProps {
    temple: Temple; // Used for initial ID, then detailed data is fetched
    onBack: () => void;
    onNavigateToDashboard: () => void;
}

// --- REUSABLE SUB-COMPONENTS ---
const Section: React.FC<{ id: string; title: string; icon: React.ReactNode; children: React.ReactNode; refProp: (el: HTMLElement | null) => void }> = ({ id, title, icon, children, refProp }) => (
    <section id={id} ref={refProp} className="py-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
            <div className="text-saffron">{icon}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-maroon">{title}</h2>
        </div>
        {children}
    </section>
);

const PujaCard: React.FC<{ puja: Puja; onBook: (puja: Puja) => void }> = ({ puja, onBook }) => {
    const { t } = useContext(LanguageContext);
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-transform hover:shadow-lg hover:-translate-y-1">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-maroon">{t(puja.nameKey)}</h3>
                <p className="text-gray-600 mt-1">{t(puja.descriptionKey)}</p>
                {puja.isEPuja && puja.detailsKey && (
                     <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-800">
                        <p><strong>{t('templeDetail.epujaTitle')}:</strong> {t(puja.detailsKey)}</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 gap-3">
                <p className="text-2xl font-bold text-gray-800">₹{puja.price.toLocaleString('en-IN')}</p>
                <button
                    onClick={() => onBook(puja)}
                    className="bg-saffron text-white font-bold py-2 px-6 rounded-full hover:bg-orange-500 transition-colors whitespace-nowrap"
                >
                    {puja.isEPuja ? t('templeDetail.bookEPuja') : t('common.bookNow')}
                </button>
            </div>
        </div>
    );
};

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-start gap-3">
        <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
        <p className="text-gray-700">{text}</p>
    </div>
);

const ReviewCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
        <Quote className="text-saffron/50 mb-2" size={32} />
        <p className="text-gray-700 italic">"{testimonial.quote}"</p>
        <div className="text-right mt-4">
            <p className="font-bold text-maroon">{testimonial.author}</p>
            <p className="text-sm text-gray-500">{testimonial.location}</p>
        </div>
    </div>
);

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-orange-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4"
                aria-expanded={isOpen}
            >
                <h4 className="text-lg font-semibold text-maroon">{question}</h4>
                <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-4 text-gray-700 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

const TempleGlanceCard: React.FC<{ temple: Temple }> = ({ temple }) => {
    const { t } = useContext(LanguageContext);
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-orange-100">
            <h3 className="text-lg font-bold text-maroon mb-4">{t('templeDetail.atAGlance')}</h3>
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <BookMarked className="text-saffron mt-1" size={20} />
                    <div>
                        <p className="text-sm text-gray-500">{t('templeDetail.mainDeity')}</p>
                        <p className="font-bold text-gray-800">{t(temple.deityKey)}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Award className="text-saffron mt-1" size={20} />
                    <div>
                        <p className="text-sm text-gray-500">{t('templeDetail.famousPuja')}</p>
                        <p className="font-bold text-gray-800">{t(temple.famousPujaKey)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TempleSidebar: React.FC<{ temple: Temple; onScrollToPackages: () => void; }> = ({ temple, onScrollToPackages }) => {
    const { t } = useContext(LanguageContext);
    return (
         <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                <TempleGlanceCard temple={temple} />
                <div className="bg-white p-5 rounded-xl shadow-lg border border-orange-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-saffron"><HeartHandshake size={28} /></div>
                        <h2 className="text-lg font-bold text-maroon">{t('templeDetail.sections.benefits')}</h2>
                    </div>
                    <div className="space-y-3">
                        {temple.benefitsKey.map(benefit => <BenefitItem key={benefit} text={t(benefit)} />)}
                    </div>
                </div>
                 <button 
                    onClick={onScrollToPackages}
                    className="w-full bg-maroon text-white font-bold py-3 px-4 rounded-lg hover:bg-red-900 transition-colors text-lg"
                 >
                    {t('templeDetail.bookPujaCta')}
                 </button>
            </div>
        </aside>
    );
}


// --- MAIN TEMPLE DETAIL PAGE COMPONENT ---
const TempleDetailPage: React.FC<TempleDetailPageProps> = ({ temple: initialTemple, onBack, onNavigateToDashboard }) => {
    const [temple, setTemple] = useState<Temple | null>(null);
    const [reviews, setReviews] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pujaToBook, setPujaToBook] = useState<Puja | null>(null);
    const [activeSection, setActiveSection] = useState('about');
    const [isNavSticky, setIsNavSticky] = useState(false);
    const { t } = useContext(LanguageContext);
    
    const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
    const navRef = useRef<HTMLDivElement | null>(null);
    const navSentinelRef = useRef<HTMLDivElement | null>(null); // For detecting when nav becomes sticky

    // --- Data Fetching ---
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [templeResponse, testimonialsResponse] = await Promise.all([
                    getTempleById(initialTemple.id),
                    getTestimonials()
                ]);
                
                const templeData = templeResponse.data.data;
                const allTestimonials = testimonialsResponse.data.data;

                if (templeData) {
                    setTemple(templeData);
                    const templeReviews = allTestimonials.filter(review => templeData.reviewIds.includes(review.id));
                    setReviews(templeReviews);
                }
            } catch (error) {
                console.error("Failed to fetch temple details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [initialTemple.id]);

    // --- Intersection Observer for Sticky Nav & Section Highlighting ---
     useEffect(() => {
        if (isLoading) return;

        // Observer for making the nav sticky
        const stickyObserver = new IntersectionObserver(
            ([entry]) => setIsNavSticky(!entry.isIntersecting),
            { rootMargin: '-72px 0px 0px 0px' } // 72px is header height
        );
        if (navSentinelRef.current) {
            stickyObserver.observe(navSentinelRef.current);
        }

        // Observer for highlighting active section
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-25% 0px -75% 0px' } // Highlights when section is in the top quarter of the viewport
        );

        const sectionElements = Object.values(sectionsRef.current);
        sectionElements.forEach(el => {
            if (el instanceof Element) {
                sectionObserver.observe(el);
            }
        });

        return () => {
            stickyObserver.disconnect();
            sectionObserver.disconnect();
        };
    }, [isLoading]);

    const scrollToSection = (id: string) => {
        const element = sectionsRef.current[id];
        if (element) {
            const headerOffset = 80; // height of header + sticky nav
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };
    
    const setSectionRef = (id: string) => (el: HTMLElement | null) => {
        sectionsRef.current[id] = el;
    };

    const navItems = [
        { id: 'about', label: t('templeDetail.nav.about'), icon: <Info size={18} /> },
        { id: 'packages', label: t('templeDetail.nav.packages'), icon: <Sparkles size={18} /> },
        { id: 'reviews', label: t('templeDetail.nav.reviews'), icon: <Star size={18} /> },
        { id: 'faq', label: t('templeDetail.nav.faq'), icon: <Info size={18} /> },
    ];


    if (isLoading || !temple) {
        return <div className="min-h-screen bg-orange-50/50 flex items-center justify-center">Loading Temple Details...</div>;
    }

    const ePuja = temple.pujas.find(p => p.isEPuja);
    const inPersonPujas = temple.pujas.filter(p => !p.isEPuja);

    return (
        <>
            <div className="bg-orange-50/50">
                {/* Hero Section */}
                <div className="relative h-64 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url('${temple.imageUrl}')` }}>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <button onClick={onBack} className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-full hover:bg-white/30 transition-colors">
                        <ArrowLeft size={20} />
                        {t('templeDetail.back')}
                    </button>
                    <div className="absolute bottom-0 left-0 p-4 md:p-8 z-10 container mx-auto">
                        <h1 className="text-3xl md:text-5xl font-bold text-white shadow-text">{t(temple.nameKey)}</h1>
                        <p className="text-lg text-white/90 flex items-center mt-2">
                            <MapPin size={18} className="mr-2" />
                            {t(temple.locationKey)}
                        </p>
                    </div>
                </div>
                
                {/* Nav Sentinel - an invisible element to trigger the sticky observer */}
                <div ref={navSentinelRef}></div>

                {/* Sticky Nav */}
                <div ref={navRef} className={`sticky top-[71px] z-30 transition-shadow duration-200 ${isNavSticky ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
                    <div className="container mx-auto">
                        <nav className="flex justify-center border-b border-orange-200">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 py-4 px-3 sm:px-5 font-semibold border-b-4 transition-all duration-200 ${activeSection === item.id ? 'text-maroon border-saffron' : 'text-gray-600 border-transparent hover:text-maroon hover:border-saffron/50'}`}
                                >
                                    {item.icon}
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="container mx-auto px-4 mt-8 pb-16">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                        {/* Left Column (Main Content) */}
                        <main className="lg:col-span-2">
                            <div className="block lg:hidden mb-8"><TempleGlanceCard temple={temple} /></div>
                            
                            <Section id="about" title={t('templeDetail.sections.about')} icon={<Info size={28} />} refProp={setSectionRef('about')}>
                                <p className="text-gray-700 leading-relaxed text-lg">{t(temple.descriptionKey)}</p>
                            </Section>

                             {/* Benefits Section (Mobile Only) */}
                            <div className="block lg:hidden">
                                <Section id="benefits-mobile" title={t('templeDetail.sections.benefits')} icon={<HeartHandshake size={28} />} refProp={() => {}}>
                                    <div className="grid grid-cols-1 gap-y-4">
                                        {temple.benefitsKey.map(benefit => <BenefitItem key={benefit} text={t(benefit)} />)}
                                    </div>
                                </Section>
                            </div>

                            <Section id="packages" title={t('templeDetail.sections.packages')} icon={<Sparkles size={28} />} refProp={setSectionRef('packages')}>
                                <div className="space-y-6">
                                    {ePuja && <PujaCard puja={ePuja} onBook={setPujaToBook} />}
                                    {inPersonPujas.length > 0 && <h3 className="text-xl font-semibold text-gray-800 pt-6">{t('templeDetail.inPersonPujasTitle')}</h3>}
                                    {inPersonPujas.map(puja => <PujaCard key={puja.id} puja={puja} onBook={setPujaToBook} />)}
                                </div>
                            </Section>

                            <Section id="reviews" title={t('templeDetail.sections.reviews')} icon={<Star size={28} />} refProp={setSectionRef('reviews')}>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {reviews.map(review => <ReviewCard key={review.id} testimonial={review} />)}
                                 </div>
                            </Section>

                            <Section id="faq" title={t('templeDetail.sections.faq')} icon={<Info size={28} />} refProp={setSectionRef('faq')}>
                                 <div className="space-y-2">
                                    {temple.faq.map(item => <FaqItem key={item.questionKey} question={t(item.questionKey)} answer={t(item.answerKey)} />)}
                                </div>
                            </Section>
                        </main>

                        {/* Right Column (Sticky Sidebar for Desktop) */}
                        <TempleSidebar temple={temple} onScrollToPackages={() => scrollToSection('packages')} />
                    </div>
                </div>
            </div>
            {pujaToBook && <BookingModal puja={pujaToBook} templeNameKey={temple.nameKey} onClose={() => setPujaToBook(null)} onNavigateToDashboard={onNavigateToDashboard} />}
        </>
    );
};

export default TempleDetailPage;
