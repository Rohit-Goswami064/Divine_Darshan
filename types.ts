
import type { LucideProps } from 'lucide-react';
import type React from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'temple_manager';
  assignedTempleId?: number;
  mobile?: string;
}

export interface Puja {
  id: number;
  nameKey: string;
  descriptionKey: string;
  price: number;
  isEPuja?: boolean;
  detailsKey?: string;
  virtualTourLink?: string;
  requirementsKey?: string;
}

export interface AvailablePrasad {
    id: number;
    nameKey: string;
    descriptionKey: string;
    imageUrl: string;
    priceMonthly: number;
    priceQuarterly: number;
}

export interface Temple {
  id: number;
  nameKey: string;
  locationKey: string;
  deityKey: string;
  famousPujaKey: string;
  imageUrl: string;
  descriptionKey: string;
  gallery: string[];
  pujas: Puja[];
  availablePrasads?: AvailablePrasad[];
  benefitsKey: string[];
  reviewIds: number[];
  faq: {
    questionKey: string;
    answerKey: string;
  }[];
}

export interface QuickAction {
  id: number;
  labelKey: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export interface Service {
    id: number;
    titleKey: string;
    descriptionKey: string;
    // FIX: Changed icon type to string to match backend data model.
    icon: string;
}

export interface Testimonial {
    id: number;
    quote: string;
    author: string;
    location: string;
}

export interface Booking {
  id: string; // transactionId
  userId: string;
  userEmail: string;
  pujaNameKey: string;
  templeNameKey: string;
  date: string; // YYYY-MM-DD format
  status: 'Confirmed' | 'Completed';
  price: number;
  isEPuja?: boolean;
  liveStreamLink?: string;
  numDevotees: number;
  fullName: string;
  phoneNumber: string;
}

export interface PrasadSubscription {
  id: string; // razorpay_payment_id
  userId: string;
  templeNameKey: string;
  prasadNameKey: string;
  frequency: 'Monthly' | 'Quarterly';
  nextDeliveryDate: string; // YYYY-MM-DD format
  status: 'Active' | 'Cancelled';
  price: number;
  fullName: string;
  phoneNumber: string;
  address: string;
}

export interface TourPackage {
    id: number;
    nameKey: string;
    descriptionKey: string;
    imageUrl: string;
    price: number;
    durationKey: string;
}

export interface SpecialSeva {
    id: number;
    nameKey: string;
    descriptionKey: string;
    imageUrl: string;
    price: number;
    templeNameKey: string;
    benefitsKey: string;
}

export interface SeasonalEvent {
    title: string;
    description: string;
    cta: string;
    imageUrl: string;
}
