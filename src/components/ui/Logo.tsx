import React from 'react';

interface LogoProps {
  variant?: 'full' | 'minimal' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ 
  variant = 'full', 
  size = 'md', 
  className = '', 
  showTagline = true 
}: LogoProps) {
  const sizeConfig = {
    sm: {
      text: 'text-lg',
      icon: 'w-6 h-6',
      tagline: 'text-xs',
      container: 'gap-2',
      image: 'h-6'
    },
    md: {
      text: 'text-xl',
      icon: 'w-12 h-12',
      tagline: 'text-sm',
      container: 'gap-2',
      image: 'h-12'
    },
    lg: {
      text: 'text-2xl',
      icon: 'w-10 h-10',
      tagline: 'text-base',
      container: 'gap-3',
      image: 'h-10'
    },
    xl: {
      text: 'text-4xl',
      icon: 'w-16 h-16',
      tagline: 'text-lg',
      container: 'gap-4',
      image: 'h-16'
    },
    '2xl': {
      text: 'text-5xl',
      icon: 'w-24 h-24',
      tagline: 'text-xl',
      container: 'gap-5',
      image: 'h-24'
    },
    '3xl': {
      text: 'text-6xl',
      icon: 'w-28 h-28 md:w-32 md:h-32',
      tagline: 'text-2xl',
      container: 'gap-6',
      image: 'h-28 md:h-32'
    }
  };

  const config = sizeConfig[size];

  // Logo Image Component
  const LogoIcon = ({ className }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <img
        src="/images/logo.png"
        alt="Mobizilla Logo"
        className={`${config.image} w-auto object-contain`}
        loading="lazy"
      />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`${config.icon} ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${config.container} ${className}`}>
      <div className={`${config.icon} flex-shrink-0`}>
        <LogoIcon />
      </div>
      
      {showTagline && variant === 'full' && (
        <div className={`${config.tagline} text-gray-600 font-medium ml-2 break-words min-w-0`}>
          <span className="text-[#1E88E5]">Repairs Made </span>
          <span className="text-[#4CAF50]">Easier</span>
        </div>
      )}
    </div>
  );
}

// Export individual components for specific use cases
export const LogoIcon = Logo;
export const LogoImage = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; className?: string }) => {
  const sizeConfig = {
    sm: 'h-6',
    md: 'h-12', 
    lg: 'h-10',
    xl: 'h-16',
    '2xl': 'h-24'
  };
  
  return (
    <img
      src="/images/logo.png"
      alt="Mobizilla Logo"
      className={`${sizeConfig[size]} w-auto object-contain ${className}`}
      loading="lazy"
    />
  );
};