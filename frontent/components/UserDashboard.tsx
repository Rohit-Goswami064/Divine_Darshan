import React, { useState, useContext, useEffect } from 'react';
import { Ticket, User, LogOut, Calendar, CheckCircle, History, Video, X, Gift, RefreshCw, XCircle, Info, Phone, Users as UsersIcon } from 'lucide-react';
import { Booking, PrasadSubscription } from '../types';
import { getUserBookings, getSubscriptionsByUserId } from '../services/api';
import { LanguageContext } from '../contexts/LanguageContext';
import { AuthContext } from '../contexts/AuthContext';

interface UserDashboardProps {
    onLogout: () => void;
}

const BookingCard: React.FC<{ booking: Booking, onViewStream: (link: string) => void, onViewDetails: (booking: Booking) => void }> = ({ booking, onViewStream, onViewDetails }) => {
    const { t, language } = useContext(LanguageContext);
    const today = new Date().toISOString().split('T')[0];
    const isUpcoming = booking.date >= today;
    const canViewStream = isUpcoming && booking.isEPuja && booking.liveStreamLink;
    const bookingStatus = booking.status === 'Confirmed' ? t('dashboard.statuses.confirmed') : t('dashboard.statuses.completed');

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-lg">
            <div>
                <h4 className="font-bold text-maroon text-lg">{t(booking.pujaNameKey)}</h4>
                <p className="text-sm text-gray-600 mt-1">{t(booking.templeNameKey)}</p>
                <p className="text-sm text-gray-800 font-medium mt-2 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" /> 
                    {new Date(booking.date + 'T00:00:00').toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full self-start ${isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {bookingStatus}
                </span>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <button onClick={() => onViewDetails(booking)} className="text-sm text-saffron font-bold hover:underline whitespace-nowrap">
                        {t('dashboard.buttons.viewDetails')}
                    </button>
                    {canViewStream ? (
                        <button 
                            onClick={() => onViewStream(booking.liveStreamLink!)}
                            className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 transition-colors whitespace-nowrap text-sm"
                        >
                            <Video size={16} />
                            {t('dashboard.buttons.viewStream')}
                        </button>
                    ) : ( isUpcoming && booking.isEPuja &&
                        <span className="text-xs text-gray-500 italic">{t('dashboard.streamLinkPending')}</span>
                    )}
                </div>
            </div>
        </div>
    );
};


const SubscriptionCard: React.FC<{ subscription: PrasadSubscription }> = ({ subscription }) => {
    const { t, language } = useContext(LanguageContext);
    const handleRenew = () => {
        console.log(`Renewing subscription: ${subscription.id}`);
    };

    const handleCancel = () => {
        const isConfirmed = window.confirm(t('dashboard.subscriptions.confirmCancel', {prasadName: t(subscription.prasadNameKey), templeName: t(subscription.templeNameKey)}));
        if (isConfirmed) {
            console.log(`Cancelling subscription: ${subscription.id}`);
            alert(t('dashboard.subscriptions.cancelSuccess'));
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
            <h4 className="font-bold text-maroon">{t(subscription.prasadNameKey)}</h4>
            <p className="text-sm text-gray-600">{t(subscription.templeNameKey)}</p>
            <div className="mt-3 text-sm space-y-1">
                <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{t('dashboard.subscriptions.frequency')}:</span>
                    <span>{subscription.frequency === 'Monthly' ? t('dashboard.subscriptions.monthly') : t('dashboard.subscriptions.quarterly')}</span>
                </p>
                <p className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{t('dashboard.subscriptions.nextDelivery')}:</span>
                    <span>{new Date(subscription.nextDeliveryDate + 'T00:00:00').toLocaleDateString(language, { day: 'numeric', month: 'short' })}</span>
                </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
                 <button onClick={handleRenew} className="flex-1 text-sm flex items-center justify-center gap-1.5 bg-green-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-green-700 transition-colors">
                    <RefreshCw size={14} />
                    {t('dashboard.buttons.renew')}
                </button>
                <button onClick={handleCancel} className="flex-1 text-sm flex items-center justify-center gap-1.5 bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-md hover:bg-gray-300 transition-colors">
                    <XCircle size={14} />
                    {t('dashboard.buttons.cancel')}
                </button>
            </div>
        </div>
    );
};


const LiveStreamModal: React.FC<{ streamUrl: string; onClose: () => void }> = ({ streamUrl, onClose }) => {
    const { t } = useContext(LanguageContext);
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-black rounded-xl shadow-2xl w-full max-w-4xl m-4 relative transform transition-all animate-fade-in-up aspect-video"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 bg-white text-maroon rounded-full p-1.5 z-10 shadow-lg hover:scale-110 transition-transform"
                    aria-label={t('dashboard.aria.closeStream')}
                >
                    <X size={24} />
                </button>
                <iframe
                    className="w-full h-full rounded-xl"
                    src={streamUrl}
                    title={t('dashboard.streamTitle')}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

const BookingDetailsModal: React.FC<{ booking: Booking; onClose: () => void }> = ({ booking, onClose }) => {
    const { t, language } = useContext(LanguageContext);
    const bookingStatus = booking.status === 'Confirmed' ? t('dashboard.statuses.confirmed') : t('dashboard.statuses.completed');
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-details-title"
        >
            <div
                className="bg-orange-50 rounded-xl shadow-2xl w-full max-w-md m-4 p-6 relative transform transition-all animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-maroon transition-colors"
                    aria-label={t('dashboard.aria.closeDetails')}
                >
                    <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-4 border-b border-orange-200 pb-4">
                    <Info className="text-saffron" size={28} />
                    <div>
                        <h2 id="booking-details-title" className="text-xl font-bold text-maroon">{t(booking.pujaNameKey)}</h2>
                        <p className="text-sm text-gray-600">{t(booking.templeNameKey)}</p>
                    </div>
                </div>
                <div className="space-y-5">
                    <div>
                        <h4 className="font-semibold text-maroon mb-2">{t('dashboard.details.devoteeInfo')}</h4>
                        <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-3"><User size={16} className="text-gray-500 flex-shrink-0" /> <span className='font-medium text-gray-800'>{booking.fullName}</span></p>
                            <p className="flex items-center gap-3"><Phone size={16} className="text-gray-500 flex-shrink-0" /> <span className='font-medium text-gray-800'>+91 {booking.phoneNumber}</span></p>
                            <p className="flex items-center gap-3"><UsersIcon size={16} className="text-gray-500 flex-shrink-0" /> <span className='font-medium text-gray-800'>{t('dashboard.details.devoteesCount', {count: booking.numDevotees})}</span></p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-maroon mb-2">{t('dashboard.details.bookingInfo')}</h4>
                        <div className="space-y-2 text-sm bg-white p-3 rounded-lg border border-orange-100">
                             <p className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">{t('dashboard.details.date')}:</span>
                                <span className="font-medium text-gray-800">{new Date(booking.date + 'T00:00:00').toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                             </p>
                              <p className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">{t('dashboard.details.status')}:</span>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {bookingStatus}
                                </span>
                             </p>
                              <p className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">{t('dashboard.details.price')}:</span>
                                <span className="font-bold text-gray-800">₹{booking.price.toLocaleString('en-IN')}</span>
                             </p>
                             <div className="pt-2 border-t border-orange-200">
                                 <p className="font-semibold text-gray-600 mb-1">{t('dashboard.details.transactionId')}:</p>
                                 <p className="font-mono bg-gray-100 text-gray-800 p-2 rounded text-xs break-words">{booking.id}</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const { t } = useContext(LanguageContext);
    const { user } = useContext(AuthContext);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [subscriptions, setSubscriptions] = useState<PrasadSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    const [userBookings, userSubscriptions] = await Promise.all([
                        getUserBookings(),
                        getSubscriptionsByUserId(user.id)
                    ]);
                    setBookings(userBookings.data.data);
                    setSubscriptions(userSubscriptions.data.data);
                } catch (error) {
                    console.error("Failed to fetch dashboard data:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [user]);

    const today = new Date().toISOString().split('T')[0];
    const upcomingBookings = bookings.filter(b => b.date >= today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastBookings = bookings.filter(b => b.date < today).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <div className="bg-orange-50/70 min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-maroon">{t('dashboard.title')}</h1>
                            <p className="text-gray-600">{t('dashboard.welcome', { name: user?.name })}</p>
                        </div>
                        <button 
                            onClick={onLogout}
                            className="flex items-center gap-2 bg-saffron text-maroon font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-all"
                        >
                            <LogOut size={18} />
                            <span>{t('dashboard.buttons.logout')}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <Ticket className="text-saffron" size={28} />
                                    <h2 className="text-2xl font-bold text-maroon">{t('dashboard.bookings.title')}</h2>
                                </div>
                                {isLoading ? (<div className="text-center py-12">Loading bookings...</div>) : 
                                bookings.length > 0 ? (
                                    <div className="space-y-6">
                                        {upcomingBookings.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3"><CheckCircle size={20} className="text-green-600" /><h3 className="text-lg font-semibold text-gray-700">{t('dashboard.bookings.upcoming')}</h3></div>
                                                <div className="space-y-4">{upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} onViewStream={setStreamUrl} onViewDetails={setSelectedBooking} />)}</div>
                                            </div>
                                        )}
                                        {pastBookings.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3"><History size={20} className="text-gray-500" /><h3 className="text-lg font-semibold text-gray-700">{t('dashboard.bookings.past')}</h3></div>
                                                <div className="space-y-4">{pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} onViewStream={setStreamUrl} onViewDetails={setSelectedBooking} />)}</div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-lg">
                                        <p className="text-gray-500">{t('dashboard.bookings.none.line1')}</p>
                                        <p className="text-gray-500 text-sm mt-1">{t('dashboard.bookings.none.line2')}</p>
                                        <button className="mt-4 bg-saffron text-white font-bold py-2 px-5 rounded-full hover:bg-orange-500 transition-colors">{t('dashboard.bookings.none.cta')}</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-1 space-y-8">
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3 mb-4"><User className="text-saffron" size={28} /><h2 className="text-2xl font-bold text-maroon">{t('dashboard.profile.title')}</h2></div>
                                <div className="space-y-4">
                                    <div><label className="text-sm font-medium text-gray-500">{t('dashboard.profile.name')}</label><p className="font-semibold text-gray-800">{user?.name}</p></div>
                                    <div><label className="text-sm font-medium text-gray-500">{t('dashboard.profile.phone')}</label><p className="font-semibold text-gray-800">{user?.mobile ? `+91 ${user.mobile}` : 'N/A'}</p></div>
                                    <div><label className="text-sm font-medium text-gray-500">{t('dashboard.profile.email')}</label><p className="font-semibold text-gray-800">{user?.email}</p></div>
                                    <button className="w-full mt-2 bg-maroon text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-900 transition-colors">{t('dashboard.buttons.editProfile')}</button>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center gap-3 mb-4"><Gift className="text-saffron" size={28} /><h2 className="text-2xl font-bold text-maroon">{t('dashboard.subscriptions.title')}</h2></div>
                                <div className="space-y-4">
                                    {isLoading ? <div>Loading...</div> : subscriptions.length > 0 ?
                                        subscriptions.map(sub => <SubscriptionCard key={sub.id} subscription={sub} />)
                                        : <p className="text-sm text-gray-500">No active subscriptions.</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {streamUrl && <LiveStreamModal streamUrl={streamUrl} onClose={() => setStreamUrl(null)} />}
            {selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
        </>
    );
};

export default UserDashboard;
