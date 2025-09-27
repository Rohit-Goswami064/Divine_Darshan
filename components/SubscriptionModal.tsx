

import React, { useState, useEffect, useContext } from 'react';
import { AvailablePrasad, Temple, User } from '../types';
import { X, User as UserIcon, Phone, Home, CheckCircle } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';
import InputError from './InputError';
import { ToastContext } from '../contexts/ToastContext';
import { createSubscription, getApiErrorMessage } from '../services/api';

interface SubscriptionModalProps {
    prasad: AvailablePrasad;
    temple: Temple;
    user: User;
    onClose: () => void;
    onNavigateToDashboard: () => void;
}

type SubscriptionStatus = 'form' | 'submitting' | 'confirmed';

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ prasad, temple, user, onClose, onNavigateToDashboard }) => {
    const [frequency, setFrequency] = useState<'monthly' | 'quarterly'>('monthly');
    const [fullName, setFullName] = useState(user.name || '');
    const [phoneNumber, setPhoneNumber] = useState(user.mobile || '');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<SubscriptionStatus>('form');
    const { t } = useContext(LanguageContext);
    const toastContext = useContext(ToastContext);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const totalCost = frequency === 'monthly' ? prasad.priceMonthly : prasad.priceQuarterly;

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!fullName.trim() || fullName.trim().length < 3) errors.fullName = 'Please enter a name (min. 3 characters).';
        if (!/^[6-9]\d{9}$/.test(phoneNumber)) errors.phoneNumber = 'Please enter a valid 10-digit mobile number.';
        if (!address.trim() || address.trim().length < 10) errors.address = 'Please enter a full address (min. 10 characters).';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubscription = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setStatus('submitting');
        
        const options: RazorpayOptions = {
            key: 'rzp_live_VrbZkAl3ctTkzA', // Public live key
            amount: totalCost * 100,
            currency: 'INR',
            name: 'Divine Darshan Subscription',
            description: `Subscription for ${t(prasad.nameKey)}`,
            image: prasad.imageUrl,
            handler: async (response) => {
                try {
                    await createSubscription({
                        id: response.razorpay_payment_id,
                        templeNameKey: temple.nameKey,
                        prasadNameKey: prasad.nameKey,
                        frequency: frequency === 'monthly' ? 'Monthly' : 'Quarterly',
                        price: totalCost,
                        fullName,
                        phoneNumber,
                        address,
                    });
                    setStatus('confirmed');
                } catch (error) {
                    toastContext?.addToast(getApiErrorMessage(error), 'error');
                    setStatus('form');
                }
            },
            prefill: {
                name: fullName,
                email: user.email,
                contact: phoneNumber,
            },
            notes: {
                prasad_id: prasad.id.toString(),
                temple_id: temple.id.toString(),
                user_id: user.id.toString(),
                frequency: frequency,
            },
            theme: { color: '#800000' },
            modal: {
                ondismiss: () => {
                    toastContext?.addToast('Payment was cancelled.', 'info');
                    setStatus('form');
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };
    
    const handleNavigateAndClose = () => {
        onNavigateToDashboard();
        onClose();
    }

    const renderForm = () => (
        <>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-maroon" aria-label={t('subscriptionModal.aria.close')}><X size={24} /></button>
            <h2 id="subscription-modal-title" className="text-2xl font-bold text-maroon mb-1">{t('subscriptionModal.title')}: {t(prasad.nameKey)}</h2>
            <p className="text-gray-600 mb-6">{t('subscriptionModal.subtitle')}</p>
            <form onSubmit={handleSubscription} className="space-y-4">
                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">{t('subscriptionModal.labels.frequency')}</label>
                    <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as any)} required className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-saffron focus:border-saffron">
                        <option value="monthly">{t('prasadSubscriptionPage.monthly')} - ₹{prasad.priceMonthly.toLocaleString('en-IN')}/mo</option>
                        <option value="quarterly">{t('prasadSubscriptionPage.quarterly')} - ₹{prasad.priceQuarterly.toLocaleString('en-IN')}/qtr</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">{t('subscriptionModal.labels.fullName')}</label>
                    <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" id="full-name" placeholder={t('subscriptionModal.placeholders.fullName')} value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full pl-10 p-2 border border-gray-300 rounded-md" /></div>
                    <InputError message={validationErrors.fullName} />
                </div>
                 <div>
                    <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">{t('subscriptionModal.labels.phone')}</label>
                    <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="tel" id="phone-number" placeholder={t('subscriptionModal.placeholders.phone')} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required pattern="[0-9]{10}" className="w-full pl-10 p-2 border border-gray-300 rounded-md" /></div>
                    <InputError message={validationErrors.phoneNumber} />
                </div>
                 <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">{t('subscriptionModal.labels.address')}</label>
                    <div className="relative"><Home className="absolute left-3 top-3 text-gray-400" size={18} /><textarea id="address" placeholder={t('subscriptionModal.placeholders.address')} value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="w-full pl-10 p-2 border border-gray-300 rounded-md" /></div>
                    <InputError message={validationErrors.address} />
                </div>
                <div className="pt-4 border-t border-orange-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium text-gray-700">{t('subscriptionModal.total')}:</span>
                        <span className="text-2xl font-bold text-maroon">₹{totalCost.toLocaleString('en-IN')}</span>
                    </div>
                    <button type="submit" disabled={status === 'submitting'} className="w-full bg-saffron text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-500 disabled:bg-gray-400 flex items-center justify-center">{status === 'submitting' ? t('bookingModal.buttons.processing') : t('subscriptionModal.buttons.confirm')}</button>
                </div>
            </form>
        </>
    );

    const renderSuccess = () => (
        <div className="text-center p-6 flex flex-col items-center">
            <CheckCircle className="h-20 w-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-maroon">{t('subscriptionModal.success.title')}</h2>
            <p className="text-gray-600 mt-2 mb-6">{t('subscriptionModal.success.message')}</p>
            <button onClick={handleNavigateAndClose} className="w-full mt-4 bg-maroon text-white font-bold py-3 px-4 rounded-lg hover:bg-red-900">{t('subscriptionModal.buttons.viewInDashboard')}</button>
            <button onClick={onClose} className="mt-3 text-sm text-gray-600 hover:text-maroon font-semibold">{t('common.close')}</button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={status !== 'confirmed' ? onClose : undefined} role="dialog" aria-modal="true" aria-labelledby="subscription-modal-title">
            <div className="bg-orange-50 rounded-xl shadow-2xl w-full max-w-lg m-4 p-6 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
                {status === 'confirmed' ? renderSuccess() : renderForm()}
            </div>
        </div>
    );
};

export default SubscriptionModal;