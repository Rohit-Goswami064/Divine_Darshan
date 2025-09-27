import React, { useState, useMemo, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import {
    LogOut, Ticket, IndianRupee, Users,
    LayoutDashboard, Search, Bell, ChevronDown, Menu, Building2, Sparkles, FileText, Settings, ArrowUp, ArrowDown, Construction, Newspaper, Pencil, Trash2, PlusCircle, X, Gift, HeartHandshake, ShieldCheck, CheckCircle, Bus, Star, LucideIcon, ImagePlus, FilePenLine,
    MessageSquare, Link2, Image, HelpCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Booking, User, Temple, Service, Testimonial, SeasonalEvent, Puja } from '../types';
import { 
    getApiErrorMessage,
    getAllBookings, getTemples, getSubscriptionsByUserId, addTemple, updateTemple, deleteTemple, 
    getServices, addService, updateService, deleteService,
    getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    getSeasonalEvent, updateSeasonalEvent,
    getUsers
} from '../services/api';
import { LanguageContext } from '../contexts/LanguageContext';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContext } from '../contexts/ToastContext';
import InputError from './InputError';

type AdminView = 'dashboard' | 'temples' | 'services' | 'bookings' | 'payments' | 'reports' | 'content' | 'settings';

// --- PROPS & DATA ---
interface AdminDashboardProps { onLogout: () => void; }

const iconOptions: { [key: string]: LucideIcon } = {
    'Users': Users, 'Sparkles': Sparkles, 'Gift': Gift, 'Ticket': Ticket, 'Bus': Bus,
    'Star': Star, 'HeartHandshake': HeartHandshake, 'ShieldCheck': ShieldCheck,
    'CheckCircle': CheckCircle, 'Construction': Construction, 'Newspaper': Newspaper
};

const getIconName = (IconComponent: React.ElementType | undefined): string => {
    if (!IconComponent) return 'Users';
    return Object.keys(iconOptions).find(name => iconOptions[name] === IconComponent) || 'Users';
}

// --- REUSABLE SUB-COMPONENTS ---
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
        <div className="p-3 bg-saffron/20 text-saffron rounded-full">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


// --- VIEWS ---

const DashboardView: React.FC<{ bookings: Booking[]; subscriptions: any[] }> = ({ bookings, subscriptions }) => {
    const { t } = useContext(LanguageContext);
    const stats = useMemo(() => {
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, b) => acc + b.price, 0);
        const activeSubscriptions = subscriptions.filter(s => s.status === 'Active').length;
        const pendingRefunds = 0; // Placeholder
        return { totalBookings, totalRevenue, activeSubscriptions, pendingRefunds };
    }, [bookings, subscriptions]);

    const chartData = useMemo(() => {
        const bookingsByDay: { [key: string]: { bookings: number, revenue: number } } = {};
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('en-US', { weekday: 'short' });
            bookingsByDay[key] = { bookings: 0, revenue: 0 };
        }

        bookings.forEach(booking => {
            const bookingDate = new Date(booking.date + 'T00:00:00');
            const diff = new Date().getTime() - bookingDate.getTime();
            if (diff >= 0 && diff < 7 * 24 * 60 * 60 * 1000) {
                 const day = bookingDate.toLocaleDateString('en-US', { weekday: 'short' });
                 bookingsByDay[day].bookings += 1;
                 bookingsByDay[day].revenue += booking.price;
            }
        });
        
        return Object.entries(bookingsByDay).map(([name, values]) => ({
            name,
            Bookings: values.bookings,
            Revenue: values.revenue
        }));
    }, [bookings]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('adminDashboard.stats.totalBookings')} value={stats.totalBookings} icon={<Ticket size={24} />} />
                <StatCard title={t('adminDashboard.stats.revenueToday')} value={`₹${chartData[chartData.length - 1]?.Revenue.toLocaleString('en-IN') || 0}`} icon={<IndianRupee size={24} />} />
                <StatCard title={t('adminDashboard.stats.activeSubscriptions')} value={stats.activeSubscriptions} icon={<Newspaper size={24} />} />
                <StatCard title={t('adminDashboard.stats.pendingRefunds')} value={stats.pendingRefunds} icon={<IndianRupee size={24} />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Last 7 Days Overview</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#FF99331A' }} />
                                <Legend wrapperStyle={{ fontSize: '14px' }} />
                                <Bar yAxisId="left" dataKey="Bookings" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="Revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                     <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Bookings</h3>
                     <div className="space-y-4">
                        {[...bookings].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(booking => (
                            <div key={booking.id} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-semibold text-gray-700">{booking.fullName}</p>
                                    <p className="text-xs text-gray-500">{t(booking.pujaNameKey)}</p>
                                </div>
                                <p className="font-bold text-maroon">₹{booking.price.toLocaleString('en-IN')}</p>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

const BookingsView: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
    const { t, language } = useContext(LanguageContext);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Booking; direction: 'asc' | 'desc' } | null>(null);

    const sortedBookings = useMemo(() => {
        let sortableItems = [...bookings];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA < valB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [bookings, sortConfig]);

    const requestSort = (key: keyof Booking) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };


    const SortableHeader: React.FC<{ sortKey: keyof Booking; children: ReactNode }> = ({ sortKey, children }) => (
        <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort(sortKey)}>
            <div className="flex items-center gap-1">
                {children}
                {sortConfig?.key === sortKey && (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
            </div>
        </th>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('adminDashboard.bookings.title')}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader sortKey="userEmail">{t('adminDashboard.bookings.user')}</SortableHeader>
                            <SortableHeader sortKey="pujaNameKey">Puja</SortableHeader>
                            <SortableHeader sortKey="templeNameKey">Temple</SortableHeader>
                            <SortableHeader sortKey="date">Date</SortableHeader>
                            <SortableHeader sortKey="price">Price</SortableHeader>
                            <SortableHeader sortKey="status">Status</SortableHeader>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="p-3 whitespace-nowrap text-sm text-gray-800">{booking.userEmail}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600">{t(booking.pujaNameKey)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600">{t(booking.templeNameKey)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600">{new Date(booking.date + 'T00:00:00').toLocaleDateString(language, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-800 font-semibold">₹{booking.price.toLocaleString('en-IN')}</td>
                                <td className="p-3 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap text-sm">
                                    <button className="text-saffron font-semibold hover:text-orange-600">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white p-10 rounded-xl shadow-sm flex flex-col items-center justify-center text-center h-full">
        <Construction size={48} className="text-saffron mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 mt-2">This feature is currently under construction. Please check back later.</p>
    </div>
);

const PujaModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (puja: Puja) => void; puja: Partial<Puja> | null; t: (key: string) => string; }> = ({ isOpen, onClose, onSave, puja, t }) => {
    const [formData, setFormData] = useState<Partial<Puja>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(puja || {});
            setValidationErrors({});
        }
    }, [puja, isOpen]);
    
    if (!isOpen) return null;

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!formData.nameKey?.trim()) errors.nameKey = 'Name key is required.';
        if (!formData.descriptionKey?.trim()) errors.descriptionKey = 'Description key is required.';
        if (!formData.price || formData.price <= 0) errors.price = 'Price must be a positive number.';
        if (formData.isEPuja && !formData.detailsKey?.trim()) errors.detailsKey = 'E-Puja details are required.';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : (name === 'price' ? parseFloat(value) : value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData as Puja);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-bold text-maroon">{puja?.id ? 'Edit Puja' : 'Add New Puja'}</h3>
                        <button type="button" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name Key</label>
                            <input type="text" name="nameKey" value={formData.nameKey || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.nameKey} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description Key</label>
                            <textarea name="descriptionKey" value={formData.descriptionKey || ''} onChange={handleChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.descriptionKey} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input type="number" name="price" value={formData.price || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.price} />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                             <input type="checkbox" id="isEPuja" name="isEPuja" checked={!!formData.isEPuja} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-saffron focus:ring-saffron" />
                             <label htmlFor="isEPuja" className="text-sm font-medium text-gray-700">This is an E-Puja</label>
                        </div>
                        {formData.isEPuja && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">E-Puja Details Key</label>
                                    <textarea name="detailsKey" value={formData.detailsKey || ''} onChange={handleChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                    <InputError message={validationErrors.detailsKey} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Requirements Key</label>
                                    <input type="text" name="requirementsKey" value={formData.requirementsKey || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">Live Stream Link</label>
                                    <input type="url" name="virtualTourLink" value={formData.virtualTourLink || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-saffron text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-500">Save Puja</button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

const FaqModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (faq: { questionKey: string; answerKey: string }) => void; faq: { questionKey: string; answerKey: string } | null; t: (key: string) => string; }> = ({ isOpen, onClose, onSave, faq, t }) => {
    const [formData, setFormData] = useState({ questionKey: '', answerKey: '' });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(faq || { questionKey: '', answerKey: '' });
            setValidationErrors({});
        }
    }, [faq, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!formData.questionKey.trim()) errors.questionKey = 'Question key is required.';
        if (!formData.answerKey.trim()) errors.answerKey = 'Answer key is required.';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-bold text-maroon">{faq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                        <button type="button" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.questionKey')}</label>
                            <input type="text" name="questionKey" value={formData.questionKey} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.questionKey} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.answerKey')}</label>
                            <textarea name="answerKey" value={formData.answerKey} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.answerKey} />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-saffron text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-500">Save FAQ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TempleModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (temple: Partial<Temple>) => void; temple: Partial<Temple> | null; t: (key: string) => string; }> = ({ isOpen, onClose, onSave, temple, t }) => {
    const [formData, setFormData] = useState<Partial<Temple>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    
    // State for Puja modal
    const [isPujaModalOpen, setIsPujaModalOpen] = useState(false);
    const [editingPuja, setEditingPuja] = useState<Partial<Puja> | null>(null);

    // State for FAQ modal
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<{ questionKey: string; answerKey: string } | null>(null);
    const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);


    useEffect(() => {
        if (isOpen) {
            setFormData(temple || { pujas: [], faq: [] });
            setValidationErrors({});
        }
    }, [temple, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const errors: Record<string, string> = {};
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!formData.nameKey?.trim()) errors.nameKey = 'Name key is required.';
        if (!formData.locationKey?.trim()) errors.locationKey = 'Location key is required.';
        if (!formData.deityKey?.trim()) errors.deityKey = 'Deity key is required.';
        if (!formData.famousPujaKey?.trim()) errors.famousPujaKey = 'Famous puja key is required.';
        if (!formData.imageUrl?.trim() || !urlRegex.test(formData.imageUrl)) errors.imageUrl = 'A valid image URL is required.';
        if (!formData.descriptionKey?.trim() || formData.descriptionKey.length < 20) errors.descriptionKey = 'Description key must be at least 20 characters.';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePuja = (pujaToSave: Puja) => {
        const pujas = formData.pujas ? [...formData.pujas] : [];
        if (editingPuja?.id) { // Edit existing
            const index = pujas.findIndex(p => p.id === editingPuja.id);
            if (index > -1) pujas[index] = pujaToSave;
        } else { // Add new
            const newId = pujas.length > 0 ? Math.max(...pujas.map(p => p.id)) + 1 : 1;
            pujas.push({ ...pujaToSave, id: newId });
        }
        setFormData(prev => ({ ...prev, pujas }));
        setIsPujaModalOpen(false);
        setEditingPuja(null);
    };

    const handleDeletePuja = (pujaId: number) => {
        if (window.confirm('Are you sure you want to delete this puja?')) {
            const updatedPujas = formData.pujas?.filter(p => p.id !== pujaId);
            setFormData(prev => ({ ...prev, pujas: updatedPujas }));
        }
    };
    
    const handleSaveFaq = (faqToSave: { questionKey: string; answerKey: string }) => {
        const faqs = formData.faq ? [...formData.faq] : [];
        if (editingFaqIndex !== null) { // Edit
            faqs[editingFaqIndex] = faqToSave;
        } else { // Add
            faqs.push(faqToSave);
        }
        setFormData(prev => ({ ...prev, faq: faqs }));
        setIsFaqModalOpen(false);
        setEditingFaq(null);
        setEditingFaqIndex(null);
    };

    const handleDeleteFaq = (index: number) => {
        if (window.confirm(t('adminDashboard.temples.confirmDeleteFaq'))) {
            const updatedFaqs = formData.faq?.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, faq: updatedFaqs }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
      <>
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-bold text-maroon">{temple?.id ? t('adminDashboard.temples.editTemple') : t('adminDashboard.temples.addNew')}</h3>
                        <button type="button" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {formData.id && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.id')}</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    disabled
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.nameKey')}</label>
                                <input type="text" name="nameKey" value={formData.nameKey || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                <InputError message={validationErrors.nameKey} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.locationKey')}</label>
                                <input type="text" name="locationKey" value={formData.locationKey || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                <InputError message={validationErrors.locationKey} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.deityKey')}</label>
                                <input type="text" name="deityKey" value={formData.deityKey || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                <InputError message={validationErrors.deityKey} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.famousPujaKey')}</label>
                                <input type="text" name="famousPujaKey" value={formData.famousPujaKey || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                <InputError message={validationErrors.famousPujaKey} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.imageUrl')}</label>
                            <input type="url" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.imageUrl} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.temples.form.descriptionKey')}</label>
                            <textarea name="descriptionKey" value={formData.descriptionKey || ''} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.descriptionKey} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800">Pujas & Services</h4>
                                <button type="button" onClick={() => { setEditingPuja(null); setIsPujaModalOpen(true); }} className="flex items-center gap-1 text-sm bg-saffron text-white font-bold py-1 px-3 rounded-md hover:bg-orange-500"><PlusCircle size={14}/> Add Puja</button>
                            </div>
                            <div className="space-y-2 border rounded-lg p-3 max-h-60 overflow-y-auto">
                                {formData.pujas?.map(p => (
                                    <div key={p.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div>
                                            <p className="font-semibold">{t(p.nameKey)}</p>
                                            <p className="text-sm text-gray-600">₹{p.price}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => { setEditingPuja(p); setIsPujaModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"><Pencil size={14}/></button>
                                            <button type="button" onClick={() => handleDeletePuja(p.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                                {(!formData.pujas || formData.pujas.length === 0) && <p className="text-center text-sm text-gray-500 py-4">No pujas added yet.</p>}
                            </div>
                        </div>

                        {/* FAQ Management Section */}
                        <div>
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800">{t('adminDashboard.temples.form.faqsTitle')}</h4>
                                <button type="button" onClick={() => { setEditingFaq(null); setEditingFaqIndex(null); setIsFaqModalOpen(true); }} className="flex items-center gap-1 text-sm bg-saffron text-white font-bold py-1 px-3 rounded-md hover:bg-orange-500">
                                    <PlusCircle size={14}/> {t('adminDashboard.temples.buttons.addFaq')}
                                </button>
                            </div>
                            <div className="space-y-2 border rounded-lg p-3 max-h-60 overflow-y-auto">
                                {formData.faq?.map((f, index) => (
                                    <div key={index} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                                        <div className="text-sm">
                                            <p className="font-semibold">{t(f.questionKey)}</p>
                                            <p className="text-gray-600 mt-1">{t(f.answerKey)}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                            <button type="button" onClick={() => { setEditingFaq(f); setEditingFaqIndex(index); setIsFaqModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"><Pencil size={14}/></button>
                                            <button type="button" onClick={() => handleDeleteFaq(index)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                                {(!formData.faq || formData.faq.length === 0) && <p className="text-center text-sm text-gray-500 py-4">No FAQs added yet.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{t('adminDashboard.temples.buttons.cancel')}</button>
                        <button type="submit" className="bg-saffron text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-500">{t('adminDashboard.temples.buttons.save')}</button>
                    </div>
                </form>
            </div>
        </div>
        <PujaModal isOpen={isPujaModalOpen} onClose={() => setIsPujaModalOpen(false)} onSave={handleSavePuja} puja={editingPuja} t={t} />
        <FaqModal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} onSave={handleSaveFaq} faq={editingFaq} t={t} />
      </>
    );
};

const TemplesView: React.FC = () => {
    const [temples, setTemples] = useState<Temple[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemple, setEditingTemple] = useState<Partial<Temple> | null>(null);
    const { t } = useContext(LanguageContext);
    const toastContext = useContext(ToastContext);

    const fetchTemples = useCallback(async () => {
        try {
            const response = await getTemples();
            setTemples(response.data.data);
        } catch (error) {
            toastContext?.addToast(getApiErrorMessage(error), 'error');
            console.error(error);
        }
    }, [toastContext]);

    useEffect(() => {
        fetchTemples();
    }, [fetchTemples]);
    
    const handleSaveTemple = async (temple: Partial<Temple>) => {
        try {
            if (temple.id) {
                await updateTemple(temple.id, temple);
                toastContext?.addToast('Temple updated successfully!', 'success');
            } else {
                await addTemple(temple);
                 toastContext?.addToast('Temple added successfully!', 'success');
            }
            fetchTemples();
            setIsModalOpen(false);
        } catch (error) {
            toastContext?.addToast(getApiErrorMessage(error), 'error');
            console.error(error);
        }
    };
    
    const handleDeleteTemple = async (id: number) => {
        if (window.confirm(t('adminDashboard.temples.confirmDelete'))) {
            try {
                await deleteTemple(id);
                toastContext?.addToast('Temple deleted successfully!', 'success');
                fetchTemples();
            } catch (error) {
                toastContext?.addToast(getApiErrorMessage(error), 'error');
                console.error(error);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{t('adminDashboard.temples.title')}</h2>
                <button onClick={() => { setEditingTemple(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-saffron text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-500">
                    <PlusCircle size={18} /> {t('adminDashboard.temples.addNew')}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                         <tr>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('adminDashboard.temples.table.image')}</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('adminDashboard.temples.table.name')}</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('adminDashboard.temples.table.location')}</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('adminDashboard.temples.table.deity')}</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('adminDashboard.temples.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {temples.map(temple => (
                            <tr key={temple.id} className="hover:bg-gray-50">
                                <td className="p-3"><img src={temple.imageUrl} alt={t(temple.nameKey)} className="w-16 h-12 object-cover rounded-md"/></td>
                                <td className="p-3 whitespace-nowrap text-sm font-semibold text-gray-800">{t(temple.nameKey)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600">{t(temple.locationKey)}</td>
                                <td className="p-3 whitespace-nowrap text-sm text-gray-600">{t(temple.deityKey)}</td>
                                <td className="p-3 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => { setEditingTemple(temple); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 font-semibold">{t('adminDashboard.temples.buttons.edit')}</button>
                                        <button onClick={() => handleDeleteTemple(temple.id)} className="text-red-600 hover:text-red-800 font-semibold">{t('adminDashboard.temples.buttons.delete')}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TempleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTemple} temple={editingTemple} t={t} />
        </div>
    );
};

const ServiceModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (service: Partial<Service>) => void; service: Partial<Service> | null; t: (key: string) => string; }> = ({ isOpen, onClose, onSave, service, t }) => {
    const [formData, setFormData] = useState<Partial<Service>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if(isOpen) {
            setFormData(service || {});
            setValidationErrors({});
        }
    }, [service, isOpen]);
    
    if (!isOpen) return null;

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!formData.titleKey?.trim()) errors.titleKey = 'Title key is required.';
        if (!formData.descriptionKey?.trim() || formData.descriptionKey.length < 10) errors.descriptionKey = 'Description key must be at least 10 characters.';
        if (!formData.icon) errors.icon = 'An icon must be selected.';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-bold text-maroon">{service?.id ? 'Edit Service' : 'Add New Service'}</h3>
                        <button type="button" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title Key</label>
                            <input type="text" name="titleKey" value={formData.titleKey || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.titleKey} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description Key</label>
                            <textarea name="descriptionKey" value={formData.descriptionKey || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.descriptionKey} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Icon</label>
                            <select name="icon" value={formData.icon || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="">Select an icon</option>
                                {Object.keys(iconOptions).map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                            <InputError message={validationErrors.icon} />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-saffron text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-500">Save Service</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ServicesView: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
    const { t } = useContext(LanguageContext);
    const toastContext = useContext(ToastContext);

    const fetchServices = useCallback(async () => {
        try {
            const response = await getServices();
            setServices(response.data.data);
        } catch (error) {
            toastContext?.addToast(getApiErrorMessage(error), 'error');
        }
    }, [toastContext]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleSaveService = async (service: Partial<Service>) => {
         try {
            if (service.id) {
                await updateService(service.id, service);
                toastContext?.addToast('Service updated successfully!', 'success');
            } else {
                await addService(service);
                 toastContext?.addToast('Service added successfully!', 'success');
            }
            fetchServices();
            setIsModalOpen(false);
        } catch (error) {
            toastContext?.addToast(getApiErrorMessage(error), 'error');
        }
    };
    
    const handleDeleteService = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
             try {
                await deleteService(id);
                toastContext?.addToast('Service deleted successfully!', 'success');
                fetchServices();
            } catch (error) {
                toastContext?.addToast(getApiErrorMessage(error), 'error');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Services Management</h2>
                 <button onClick={() => { setEditingService(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-saffron text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-500">
                    <PlusCircle size={18} /> Add New Service
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {services.map(service => {
                            // FIX: Removed unnecessary type assertion `as string` since `service.icon` is now correctly typed as a string.
                            const IconComponent = iconOptions[service.icon] || Users;
                            return (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="p-3"><IconComponent className="text-saffron" size={24} /></td>
                                    <td className="p-3 whitespace-nowrap text-sm font-semibold text-gray-800">{t(service.titleKey)}</td>
                                    <td className="p-3 text-sm text-gray-600 max-w-sm truncate">{t(service.descriptionKey)}</td>
                                    <td className="p-3 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => { setEditingService(service); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 font-semibold">Edit</button>
                                            <button onClick={() => handleDeleteService(service.id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <ServiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveService} service={editingService} t={t} />
        </div>
    );
};

const TestimonialModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (testimonial: Partial<Testimonial>) => void; testimonial: Partial<Testimonial> | null; t: (key: string) => string; }> = ({ isOpen, onClose, onSave, testimonial, t }) => {
    const [formData, setFormData] = useState<Partial<Testimonial>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if(isOpen) {
            setFormData(testimonial || {});
            setValidationErrors({});
        }
    }, [testimonial, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!formData.quote?.trim() || formData.quote.length < 10) errors.quote = 'Quote must be at least 10 characters.';
        if (!formData.author?.trim()) errors.author = 'Author name is required.';
        if (!formData.location?.trim()) errors.location = 'Location is required.';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-bold text-maroon">{testimonial?.id ? t('adminDashboard.content.testimonials.edit') : t('adminDashboard.content.testimonials.addNew')}</h3>
                        <button type="button" onClick={onClose}><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.content.testimonials.form.quote')}</label>
                            <textarea name="quote" value={formData.quote || ''} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.quote} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.content.testimonials.form.author')}</label>
                            <input type="text" name="author" value={formData.author || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.author} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">{t('adminDashboard.content.testimonials.form.location')}</label>
                            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            <InputError message={validationErrors.location} />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-saffron text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-500">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ContentManagementView: React.FC = () => {
    const [seasonalEvent, setSeasonalEvent] = useState<Partial<SeasonalEvent>>({});
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const { t } = useContext(LanguageContext);
    const toastContext = useContext(ToastContext);

    const fetchContent = useCallback(async () => {
        try {
            const [eventRes, testimonialsRes] = await Promise.all([getSeasonalEvent(), getTestimonials()]);
            setSeasonalEvent(eventRes.data.data);
            setTestimonials(testimonialsRes.data.data);
        } catch (error) {
            toastContext?.addToast(getApiErrorMessage(error), 'error');
        }
    }, [toastContext]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const validateEventForm = () => {
        const errors: Record<string, string> = {};
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!seasonalEvent.title?.trim()) errors.title = 'Title is required.';
        if (!seasonalEvent.description?.trim()) errors.description = 'Description is required.';
        if (!seasonalEvent.cta?.trim()) errors.cta = 'CTA text is required.';
        if (!seasonalEvent.imageUrl?.trim() || !urlRegex.test(seasonalEvent.imageUrl)) errors.imageUrl = 'A valid image URL is required.';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeasonalEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEventForm()) return;
        try {
            await updateSeasonalEvent(seasonalEvent);
            toastContext?.addToast(t('adminDashboard.content.seasonalEvent.saveSuccess'), 'success');
        } catch (error) {
            toastContext?.addToast(getApiErrorMessage(error), 'error');
        }
    };
    
    const handleSaveTestimonial = async (testimonial: Partial<Testimonial>) => {
         try {
            if (testimonial.id) {
                await updateTestimonial(testimonial.id, testimonial);
                toastContext?.addToast('Testimonial updated successfully!', 'success');
            } else {
                await addTestimonial(testimonial);
                 toastContext?.addToast('Testimonial added successfully!', 'success');
            }
            fetchContent();
            setIsModalOpen(false);
        } catch (error) {
            toastContext?.addToast(getApiErrorMessage(error), 'error');
        }
    };
    
    const handleDeleteTestimonial = async (id: number) => {
        if (window.confirm(t('adminDashboard.content.testimonials.confirmDelete'))) {
             try {
                await deleteTestimonial(id);
                toastContext?.addToast('Testimonial deleted successfully!', 'success');
                fetchContent();
            } catch (error) {
                toastContext?.addToast(getApiErrorMessage(error), 'error');
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3 mb-4">
                    <FilePenLine size={24} className="text-saffron" />
                    <h2 className="text-xl font-bold text-gray-800">{t('adminDashboard.content.seasonalEvent.title')}</h2>
                 </div>
                 <form onSubmit={handleSaveEvent} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">{t('adminDashboard.content.seasonalEvent.formTitle')}</label>
                        <input type="text" name="title" value={seasonalEvent.title || ''} onChange={handleEventChange} className="mt-1 block w-full border-gray-300 rounded-md p-2" />
                        <InputError message={validationErrors.title} />
                    </div>
                     <div>
                        <label className="text-sm font-medium">{t('adminDashboard.content.seasonalEvent.formDescription')}</label>
                        <input type="text" name="description" value={seasonalEvent.description || ''} onChange={handleEventChange} className="mt-1 block w-full border-gray-300 rounded-md p-2" />
                        <InputError message={validationErrors.description} />
                    </div>
                     <div>
                        <label className="text-sm font-medium">{t('adminDashboard.content.seasonalEvent.formCta')}</label>
                        <input type="text" name="cta" value={seasonalEvent.cta || ''} onChange={handleEventChange} className="mt-1 block w-full border-gray-300 rounded-md p-2" />
                         <InputError message={validationErrors.cta} />
                    </div>
                     <div>
                        <label className="text-sm font-medium">{t('adminDashboard.content.seasonalEvent.formImageUrl')}</label>
                        <input type="url" name="imageUrl" value={seasonalEvent.imageUrl || ''} onChange={handleEventChange} className="mt-1 block w-full border-gray-300 rounded-md p-2" />
                         <InputError message={validationErrors.imageUrl} />
                    </div>
                    <button type="submit" className="w-full bg-saffron text-white font-bold py-2 rounded-lg">Save Event Banner</button>
                 </form>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={24} className="text-saffron" />
                        <h2 className="text-xl font-bold text-gray-800">{t('adminDashboard.content.testimonials.title')}</h2>
                    </div>
                    <button onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }} className="flex items-center gap-1.5 bg-saffron text-white font-bold text-sm py-1.5 px-3 rounded-lg"><PlusCircle size={16}/> {t('adminDashboard.content.testimonials.addNew')}</button>
                 </div>
                 <div className="space-y-3 max-h-96 overflow-y-auto">
                    {testimonials.map(tmnl => (
                        <div key={tmnl.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                            <div>
                                <p className="text-sm italic text-gray-700">"{tmnl.quote}"</p>
                                <p className="text-xs font-semibold text-maroon mt-1">- {tmnl.author}</p>
                            </div>
                             <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                                <button onClick={() => { setEditingTestimonial(tmnl); setIsModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"><Pencil size={14}/></button>
                                <button onClick={() => handleDeleteTestimonial(tmnl.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            <TestimonialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTestimonial} testimonial={editingTestimonial} t={t} />
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { t } = useContext(LanguageContext);
    const { user } = useContext(AuthContext);

    // Data states
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [usersData, setUsersData] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data needed for the dashboard views
                const [bookingsRes, usersRes] = await Promise.all([
                    getAllBookings(),
                    getUsers(),
                ]);
                setBookings(bookingsRes.data.data);
                setUsersData(usersRes.data.data);
                
                // Fetch subscriptions for each user (placeholder)
                if (usersRes.data.data.length > 0) {
                    const allSubs = await Promise.all(
                        usersRes.data.data.map(u => getSubscriptionsByUserId(u.id))
                    );
                    setSubscriptions(allSubs.flatMap(res => res.data.data));
                }

            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            }
        };
        fetchData();
    }, []);

    const menuItems = [
        { id: 'dashboard', label: t('adminDashboard.menu.dashboard'), icon: LayoutDashboard },
        { id: 'temples', label: t('adminDashboard.menu.temples'), icon: Building2 },
        { id: 'services', label: t('adminDashboard.menu.services'), icon: Sparkles },
        { id: 'bookings', label: t('adminDashboard.menu.bookings'), icon: Ticket },
        { id: 'content', label: t('adminDashboard.menu.content'), icon: FileText },
        { id: 'settings', label: t('adminDashboard.menu.settings'), icon: Settings },
    ];

    const renderView = () => {
        switch (view) {
            case 'dashboard': return <DashboardView bookings={bookings} subscriptions={subscriptions} />;
            case 'bookings': return <BookingsView bookings={bookings} />;
            case 'temples': return <TemplesView />;
            case 'services': return <ServicesView />;
            case 'content': return <ContentManagementView />;
            case 'settings':
            case 'payments':
            case 'reports':
            default: return <PlaceholderView title={view.charAt(0).toUpperCase() + view.slice(1)} />;
        }
    };
    
    const Sidebar = () => (
        <aside className={`bg-maroon text-white w-64 fixed lg:relative inset-y-0 left-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <div className="p-6 flex items-center gap-3 border-b border-saffron/20">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-saffron" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5 4 5h-3v4h-2z" /></svg>
                 <span className="text-xl font-bold tracking-wider">Divine Darshan</span>
            </div>
            <nav className="mt-6">
                {menuItems.map(item => (
                    <a
                        key={item.id}
                        href="#"
                        onClick={(e) => { e.preventDefault(); setView(item.id as AdminView); setSidebarOpen(false); }}
                        className={`flex items-center gap-3 px-6 py-3 transition-colors ${view === item.id ? 'bg-saffron/20 text-saffron border-r-4 border-saffron' : 'hover:bg-saffron/10'}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );

    return (
        <div className="flex h-screen bg-orange-50/70">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center z-30">
                     <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <div className="relative hidden sm:block">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder={t('adminDashboard.searchPlaceholder')} className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-saffron" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell size={22} className="text-gray-600" />
                        <div className="flex items-center gap-2">
                             <div className="w-10 h-10 bg-saffron text-white rounded-full flex items-center justify-center font-bold">{user?.name.charAt(0)}</div>
                             <div>
                                <p className="font-semibold text-sm text-gray-800">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Temple Manager'}</p>
                             </div>
                             <button onClick={onLogout} title="Logout" className="p-2 text-gray-600 hover:text-maroon"><LogOut size={20} /></button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
