import React, { useState, useContext } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { User } from '../types';
import { ToastContext } from '../contexts/ToastContext';
import InputError from './InputError';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
    const [view, setView] = useState<'login' | 'signup' | 'forgotPassword' | 'resetSent'>('login');
    
    // Login state
    const [loginIdentifier, setLoginIdentifier] = useState('');

    // Signup state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    
    // Forgot Password state
    const [resetEmail, setResetEmail] = useState('');

    // Common state
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, signup, user } = useContext(AuthContext);
    const { t } = useContext(LanguageContext);


    const validate = () => {
        const errors: Record<string, string> = {};
        if (view === 'login') {
            if (!loginIdentifier.trim()) {
                errors.loginIdentifier = 'Please enter your email or mobile number.';
            } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(loginIdentifier) && !/^[6-9]\d{9}$/.test(loginIdentifier)) {
                errors.loginIdentifier = 'Please enter a valid email or 10-digit mobile number.';
            }
             if (password.length < 6) {
                errors.password = 'Password must be at least 6 characters long.';
            }
        }
        if (view === 'signup') {
            if (name.trim().length < 3) {
                errors.name = 'Full name must be at least 3 characters.';
            }
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                errors.email = 'Please enter a valid email address.';
            }
            if (!/^[6-9]\d{9}$/.test(mobile)) {
                 errors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
            }
            if (password.length < 6) {
                errors.password = 'Password must be at least 6 characters long.';
            }
        }
        if (view === 'forgotPassword') {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(resetEmail)) {
                errors.resetEmail = 'Please enter a valid email address.';
            }
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!validate()) return;
        
        setIsSubmitting(true);
        const result = await login(loginIdentifier, password);
        setIsSubmitting(false);

        if (result.success && user) {
             onLoginSuccess(user);
        } else {
            setFormError(result.error || t('loginModal.invalidCredentials'));
        }
    };
    
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!validate()) return;
        
        setIsSubmitting(true);
        const result = await signup(name, mobile, email, password);
        setIsSubmitting(false);

        if (result.success && user) {
            onLoginSuccess(user);
        } else {
            setFormError(result.error || t('loginModal.error.generic'));
        }
    };

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!validate()) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            console.log(`Password reset link sent to: ${resetEmail}`);
            setIsSubmitting(false);
            setView('resetSent');
        }, 1000);
    };

    const switchTo = (targetView: 'login' | 'signup' | 'forgotPassword') => (e: React.MouseEvent) => {
        e.preventDefault();
        setFormError('');
        setValidationErrors({});
        setView(targetView);
    }

    const FormErrorDisplay = () => {
        if (!formError) return null;
        return (
            <div className="flex items-start text-sm text-red-700 bg-red-100 p-3 rounded-md animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                <span>{formError}</span>
            </div>
        );
    }

    const renderLogin = () => (
        <>
            <div className="text-center mb-6">
                <h2 id="login-modal-title" className="text-2xl font-bold text-maroon">{t('loginModal.title')}</h2>
                <p className="text-gray-600 text-sm mt-1">{t('loginModal.subtitle')}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
                <FormErrorDisplay />
                <div>
                    <label htmlFor="login-identifier" className="block text-sm font-medium text-gray-700 mb-1">{t('loginModal.emailOrMobileLabel')}</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" id="login-identifier" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} required className="w-full pl-10 p-2 border border-gray-300 rounded-md" placeholder={t('loginModal.emailOrMobilePlaceholder')} aria-invalid={!!validationErrors.loginIdentifier} aria-describedby="login-identifier-error"/>
                    </div>
                    <InputError id="login-identifier-error" message={validationErrors.loginIdentifier} />
                </div>
                <div>
                    <label htmlFor="password-login"  className="block text-sm font-medium text-gray-700 mb-1">{t('loginModal.passwordLabel')}</label>
                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="password" id="password-login" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-10 p-2 border border-gray-300 rounded-md" placeholder="••••••••" aria-invalid={!!validationErrors.password} aria-describedby="password-login-error" /></div>
                     <InputError id="password-login-error" message={validationErrors.password} />
                </div>
                
                <div className="text-right -mt-2">
                    <a href="#" onClick={switchTo('forgotPassword')} className="text-sm font-medium text-saffron hover:underline">
                        {t('loginModal.forgotPassword')}
                    </a>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-saffron text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-500 disabled:bg-gray-400">{isSubmitting ? t('bookingModal.buttons.processing') : t('loginModal.loginButton')}</button>
                </div>
            </form>
             <p className="text-center text-sm mt-4 text-gray-600">{t('loginModal.switchToSignupPrompt')} <a href="#" onClick={switchTo('signup')} className="font-semibold text-saffron hover:underline">{t('loginModal.switchToSignupLink')}</a></p>
        </>
    );

    const renderSignup = () => (
         <>
            <div className="text-center mb-6">
                <h2 id="login-modal-title" className="text-2xl font-bold text-maroon">{t('loginModal.signupTitle')}</h2>
                <p className="text-gray-600 text-sm mt-1">{t('loginModal.signupSubtitle')}</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
                <FormErrorDisplay />
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('loginModal.nameLabel')}</label>
                    <div className="relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full pl-10 p-2 border border-gray-300 rounded-md" placeholder={t('bookingModal.placeholders.fullName')} aria-invalid={!!validationErrors.name} aria-describedby="name-error" /></div>
                    <InputError id="name-error" message={validationErrors.name} />
                </div>
                 <div>
                    <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-1">{t('loginModal.emailLabel')}</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="email" id="email-signup" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 p-2 border border-gray-300 rounded-md" placeholder="your@email.com" aria-invalid={!!validationErrors.email} aria-describedby="email-signup-error" /></div>
                    <InputError id="email-signup-error" message={validationErrors.email} />
                </div>
                 <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">{t('loginModal.mobileLabel')}</label>
                    <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="tel" id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} required pattern="[0-9]{10}" className="w-full pl-10 p-2 border border-gray-300 rounded-md" placeholder={t('bookingModal.placeholders.phone')} aria-invalid={!!validationErrors.mobile} aria-describedby="mobile-error" /></div>
                    <InputError id="mobile-error" message={validationErrors.mobile} />
                </div>
                <div>
                    <label htmlFor="password-signup"  className="block text-sm font-medium text-gray-700 mb-1">{t('loginModal.passwordLabel')}</label>
                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="password" id="password-signup" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-10 p-2 border border-gray-300 rounded-md" placeholder={t('loginModal.passwordPlaceholder')} aria-invalid={!!validationErrors.password} aria-describedby="password-signup-error" /></div>
                    <InputError id="password-signup-error" message={validationErrors.password} />
                </div>
                
                <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-saffron text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-500 disabled:bg-gray-400">{isSubmitting ? t('bookingModal.buttons.processing') : t('loginModal.signupButton')}</button>
                </div>
            </form>
             <p className="text-center text-sm mt-4 text-gray-600">{t('loginModal.switchToLoginPrompt')} <a href="#" onClick={switchTo('login')} className="font-semibold text-saffron hover:underline">{t('loginModal.switchToLoginLink')}</a></p>
        </>
    );

    const renderForgotPassword = () => (
        <>
            <div className="text-center mb-6">
                <h2 id="login-modal-title" className="text-2xl font-bold text-maroon">{t('loginModal.forgotPasswordTitle')}</h2>
                <p className="text-gray-600 text-sm mt-1">{t('loginModal.forgotPasswordSubtitle')}</p>
            </div>
            <form onSubmit={handlePasswordReset} className="space-y-4">
                 <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">{t('loginModal.emailLabel')}</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="email" id="reset-email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required className="w-full pl-10 p-2 border border-gray-300 rounded-md" placeholder="your@email.com" aria-invalid={!!validationErrors.resetEmail} aria-describedby="reset-email-error" /></div>
                    <InputError id="reset-email-error" message={validationErrors.resetEmail} />
                </div>
                 <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-saffron text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-500 disabled:bg-gray-400">{isSubmitting ? t('bookingModal.buttons.processing') : t('loginModal.sendResetLinkButton')}</button>
                </div>
            </form>
            <p className="text-center text-sm mt-4 text-gray-600"><a href="#" onClick={switchTo('login')} className="font-semibold text-saffron hover:underline">{t('loginModal.backToLogin')}</a></p>
        </>
    );

    const renderResetSent = () => (
        <div className="text-center p-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-maroon">{t('loginModal.resetLinkSentTitle')}</h2>
            <p className="text-gray-600 mt-2 mb-6 text-sm">{t('loginModal.resetLinkSentMessage', { email: resetEmail })}</p>
            <button onClick={onClose} className="w-full bg-maroon text-white font-bold py-3 px-4 rounded-lg hover:bg-red-900 transition-all">{t('common.close')}</button>
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'login': return renderLogin();
            case 'signup': return renderSignup();
            case 'forgotPassword': return renderForgotPassword();
            case 'resetSent': return renderResetSent();
            default: return renderLogin();
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
            <div className="bg-orange-50 rounded-xl shadow-2xl w-full max-w-sm m-4 p-8 relative transform transition-all animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-maroon" aria-label={t('loginModal.aria.close')}><X size={24} /></button>
                {renderContent()}
            </div>
        </div>
    );
};

export default LoginModal;
