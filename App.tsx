import React, { useState, useContext, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedTemples from './components/FeaturedTemples';
import ServicesOverview from './components/ServicesOverview';
import SeasonalEvents from './components/SeasonalEvents';
import Testimonials from './components/Testimonials';
import TrustBadges from './components/TrustBadges';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import TempleDetailPage from './components/TempleDetailPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import TempleListPage from './components/TempleListPage';
import PrasadSubscriptionPage from './components/PrasadSubscriptionPage';
import QueueAssistancePage from './components/QueueAssistancePage';
import TempleToursPage from './components/TempleToursPage';
import SpecialSevaPage from './components/SpecialSevaPage';
import { Temple, User } from './types';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { LanguageProvider, LanguageContext } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

type View = 'home' | 'temple' | 'user_dashboard' | 'admin_dashboard' | 'temple_list' | 'prasad_list' | 'queue_assistance' | 'temple_tours' | 'special_seva';
type TempleListMode = 'all' | 'epuja';


const AppContent: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [templeListMode, setTempleListMode] = useState<TempleListMode>('all');
    
    const { language } = useContext(LanguageContext);
    const { isAuthenticated, user, logout } = useContext(AuthContext);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
    
    // Redirect to home if user logs out from a dashboard view
    useEffect(() => {
        if (!isAuthenticated && (view === 'user_dashboard' || view === 'admin_dashboard')) {
            setView('home');
        }
    }, [isAuthenticated, view]);

    // Protect admin dashboard route from non-admin/manager users
    useEffect(() => {
        if (view === 'admin_dashboard' && isAuthenticated && user?.role !== 'admin' && user?.role !== 'temple_manager') {
            setView('user_dashboard'); // Redirect to their dashboard
        }
    }, [isAuthenticated, user, view]);

    // Protect user dashboard route from admin/manager users
    useEffect(() => {
        if (view === 'user_dashboard' && isAuthenticated && (user?.role === 'admin' || user?.role === 'temple_manager')) {
            setView('admin_dashboard');
        }
    }, [isAuthenticated, user, view]);


    const handleSelectTemple = (temple: Temple) => {
        setSelectedTemple(temple);
        setView('temple');
        window.scrollTo(0, 0);
    };

    const handleBackToHome = () => {
        setSelectedTemple(null);
        setView('home');
        window.scrollTo(0, 0);
    };

    const handleNavigateToDashboard = () => {
        if (isAuthenticated) {
            if (user?.role === 'admin' || user?.role === 'temple_manager') {
                setView('admin_dashboard');
            } else {
                setView('user_dashboard');
            }
            window.scrollTo(0, 0);
        } else {
            setLoginModalOpen(true);
        }
    }

    const handleSuccessfulLogin = (loggedInUser: User) => {
        setLoginModalOpen(false);
        if (loggedInUser.role === 'admin' || loggedInUser.role === 'temple_manager') {
             setView('admin_dashboard');
        } else {
             setView('user_dashboard');
        }
        window.scrollTo(0, 0);
    }

    const handleLogout = () => {
        logout();
        handleBackToHome();
    }
    
    const navigateToView = (targetView: View) => {
         if (!isAuthenticated) {
            setLoginModalOpen(true);
            return;
        }
        setView(targetView);
        window.scrollTo(0, 0);
    }

    const handleShowAllTemples = () => {
        setTempleListMode('all');
        setView('temple_list');
        window.scrollTo(0, 0);
    };

    const handleShowEPujaTemples = () => {
        setTempleListMode('epuja');
        setView('temple_list');
        window.scrollTo(0, 0);
    };

    const renderContent = () => {
        switch (view) {
            case 'temple':
                return <TempleDetailPage temple={selectedTemple!} onBack={handleBackToHome} onNavigateToDashboard={handleNavigateToDashboard} />;
            case 'user_dashboard':
                return <UserDashboard onLogout={handleLogout} />;
            case 'admin_dashboard':
                 // This is now handled outside the main layout
                return null;
             case 'temple_list':
                return <TempleListPage mode={templeListMode} onSelectTemple={handleSelectTemple} onBack={handleBackToHome} />;
            case 'prasad_list':
                return <PrasadSubscriptionPage onBack={handleBackToHome} onNavigateToDashboard={handleNavigateToDashboard} />;
            case 'queue_assistance':
                return <QueueAssistancePage onBack={handleBackToHome} />;
            case 'temple_tours':
                return <TempleToursPage onBack={handleBackToHome} />;
            case 'special_seva':
                return <SpecialSevaPage onBack={handleBackToHome} />;
            case 'home':
            default:
                return (
                    <>
                        <Hero 
                            onBookDarshan={handleShowAllTemples} 
                            onBookEPuja={handleShowEPujaTemples}
                            onPrasadSubscription={() => navigateToView('prasad_list')}
                            onQueueAssistance={() => navigateToView('queue_assistance')}
                            onTempleTours={() => navigateToView('temple_tours')}
                            onSpecialSeva={() => navigateToView('special_seva')}
                        />
                        <FeaturedTemples onSelectTemple={handleSelectTemple} />
                        <ServicesOverview />
                        <SeasonalEvents />
                        <Testimonials />
                        <TrustBadges />
                        <HowItWorks />
                    </>
                );
        }
    };

    // If the view is admin_dashboard, render it as a standalone page.
    if (view === 'admin_dashboard' && (user?.role === 'admin' || user?.role === 'temple_manager')) {
        return <AdminDashboard onLogout={handleLogout} />;
    }

    return (
        <div className="bg-orange-50/50 font-sans text-gray-800">
            <Header onNavigateToDashboard={handleNavigateToDashboard} onNavigateHome={handleBackToHome} />
             <ToastContainer />
            <main>
                {renderContent()}
            </main>
            <Footer />
            {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} onLoginSuccess={handleSuccessfulLogin} />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AuthProvider>
                <ToastProvider>
                    <AppContent />
                </ToastProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;