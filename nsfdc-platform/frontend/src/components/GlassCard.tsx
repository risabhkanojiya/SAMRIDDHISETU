import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'violet' | 'gold' | 'none';
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = 'none',
  onClick,
}: GlassCardProps) {
  const glowClass =
    glow === 'violet'
      ? 'glow-violet'
      : glow === 'gold'
        ? 'glow-gold'
        : '';

  return (
    <div
      onClick={onClick}
      className={`${hover ? 'glass-card' : 'glass'} ${glowClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
