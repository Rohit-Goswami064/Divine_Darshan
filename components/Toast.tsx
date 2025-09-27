import React, { useEffect } from 'react';
import { ToastMessage } from '../contexts/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
    toast: ToastMessage;
    onDismiss: (id: number) => void;
}

const icons = {
    success: <CheckCircle className="text-green-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 5000); // Auto-dismiss after 5 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [toast.id, onDismiss]);

    const baseClasses = "flex items-center p-4 mb-4 text-gray-700 bg-white rounded-lg shadow-lg w-full max-w-xs transition-all transform";
    const animationClasses = "animate-fade-in-up";

    return (
        <div className={`${baseClasses} ${animationClasses}`} role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
                {icons[toast.type]}
            </div>
            <div className="ms-3 text-sm font-semibold">{toast.message}</div>
            <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
                aria-label="Close"
                onClick={() => onDismiss(toast.id)}
            >
                <span className="sr-only">Close</span>
                <X size={20} />
            </button>
        </div>
    );
};

export default Toast;