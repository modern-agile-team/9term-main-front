'use client';

interface RecruitmentBadgeProps {
  status: 'recruiting' | 'closed' | 'always_open';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'solid';
  className?: string;
}

export default function RecruitmentBadge({ 
  status, 
  size = 'md',
  variant = 'default',
  className = '' 
}: RecruitmentBadgeProps) {
  const isRecruiting = status === 'recruiting';
  const isAlwaysOpen = status === 'always_open';
  const isClosed = status === 'closed';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const getVariantClasses = () => {
    if (isAlwaysOpen) {
      return {
        default: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        outline: 'bg-transparent text-yellow-700 border-yellow-300',
        solid: 'bg-yellow-600 text-white border-yellow-600'
      };
    } else if (isRecruiting) {
      return {
        default: 'bg-green-100 text-green-800 border-green-200',
        outline: 'bg-transparent text-green-700 border-green-300',
        solid: 'bg-green-600 text-white border-green-600'
      };
    } else {
      return {
        default: 'bg-gray-100 text-gray-800 border-gray-200',
        outline: 'bg-transparent text-gray-600 border-gray-300',
        solid: 'bg-gray-600 text-white border-gray-600'
      };
    }
  };
  
  const variantClasses = getVariantClasses();
  
  const getStatusText = () => {
    if (isAlwaysOpen) return '상시모집';
    if (isRecruiting) return '모집중';
    return '모집마감';
  };

  const getIndicatorColor = () => {
    if (isAlwaysOpen) return 'bg-yellow-500';
    if (isRecruiting) return 'bg-green-500';
    return 'bg-gray-400';
  };

  return (
    <div
      className={`
        inline-flex items-center space-x-2 rounded-full border font-medium
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isRecruiting || isAlwaysOpen ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      <div
        className={`w-2 h-2 rounded-full ${getIndicatorColor()}`}
      />
      <span>
        {getStatusText()}
      </span>
    </div>
  );
}
