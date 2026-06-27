import { ReactNode, FC } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden ${
        hover ? 'hover:shadow-lg transition-shadow duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};