import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputErrorProps {
    message?: string;
    id?: string;
}

const InputError: React.FC<InputErrorProps> = ({ message, id }) => {
    if (!message) return null;
    return (
        <div id={id} className="flex items-center text-red-600 text-xs mt-1 animate-fade-in-up" style={{ animationDuration: '0.2s' }} role="alert">
            <AlertCircle size={14} className="mr-1" />
            {message}
        </div>
    );
};

export default InputError;