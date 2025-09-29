import React, { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
    const context = useContext(ToastContext);

    if (!context) {
        return null; // Or handle the case where context is undefined
    }

    const { toasts, removeToast } = context;

    return (
        <div className="fixed top-20 right-0 z-[100] p-4">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;