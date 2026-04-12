import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'glass' | 'soft' | 'gradient';
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'white', 
  padding = true 
}) => {
  const baseStyles = "rounded-xl overflow-hidden transition-all duration-500 border border-border-light";
  
  const variants = {
    white: "bg-[#0d1f47] border-blue-900/40 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_40px_70px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1",
    glass: "backdrop-blur-xl bg-blue-950/60 shadow-xl border-blue-800/30",
    soft: "bg-[#0b1730] border-none",
    gradient: "bg-linear-to-br from-emerald-900/20 to-blue-900/20 border-blue-800/20 shadow-inner",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${padding ? 'p-8' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
