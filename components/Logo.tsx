import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`${className} hover:scale-105 transition-transform duration-300 drop-shadow-md`} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <rect x="10" y="20" width="60" height="60" rx="12" fill="url(#logo_grad)" opacity="0.9" />
    <circle cx="40" cy="50" r="12" fill="white" fillOpacity="0.3" />
    <path d="M10 65 L30 45 L50 65 L70 80 H10 Z" fill="white" fillOpacity="0.2" />
    
    <rect x="45" y="45" width="45" height="45" rx="10" fill="white" stroke="url(#logo_grad)" strokeWidth="4" />
    
    {/* Crop corners on the white box */}
    <path d="M45 55 V45 H55" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M80 45 H90 V55" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M90 80 V90 H80" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M55 90 H45 V80" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Arrow pointing to resize */}
    <path d="M58 58 L77 77 M77 77 V65 M77 77 H65" stroke="url(#logo_grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);