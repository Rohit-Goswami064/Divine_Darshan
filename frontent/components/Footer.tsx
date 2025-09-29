import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useContext(LanguageContext);
    return (
        <footer className="bg-maroon text-white/90 pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-bold text-saffron mb-4">Divine Darshan</h3>
                        <p className="text-sm">
                            {t('footer.about')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-saffron mb-4">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">{t('footer.aboutUs')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.contactUs')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.faq')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.privacy')}</a></li>
                            <li><a href="#" className="hover:text-white">{t('footer.refund')}</a></li>
                        </ul>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <h3 className="text-lg font-bold text-saffron mb-4">{t('footer.weAccept')}</h3>
                        <div className="flex space-x-2">
                           <div className="bg-white p-1 rounded-sm text-xs text-black">VISA</div>
                           <div className="bg-white p-1 rounded-sm text-xs text-black">MasterCard</div>
                           <div className="bg-white p-1 rounded-sm text-xs text-black">UPI</div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-bold text-saffron mb-4">{t('footer.followUs')}</h3>
                        <p className="text-sm mb-2">{t('footer.followUsText')}</p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white">FB</a>
                            <a href="#" className="hover:text-white">IG</a>
                            <a href="#" className="hover:text-white">YT</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-saffron/20 pt-6 text-center text-sm text-white/60">
                    <p>&copy; {new Date().getFullYear()} Divine Darshan. {t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;