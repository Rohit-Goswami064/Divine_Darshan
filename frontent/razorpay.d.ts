interface RazorpayOptions {
    key: string;
    amount: number; // in paise
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id?: string;
    handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: {
        [key: string]: string;
    };
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
    [key: string]: any; // Allow other properties
}

interface Window {
    Razorpay: new (options: RazorpayOptions) => {
        open: () => void;
    };
}