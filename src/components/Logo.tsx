import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`text-center flex flex-col items-center ${className}`}>
      <h1 className="font-heading text-primary text-2xl font-bold tracking-wider">DUDU'S</h1>
      <p className="font-heading text-accent italic text-sm tracking-wide">sweet dessert</p>
    </div>
  );
};

export default Logo;