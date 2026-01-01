'use client';

import { Button } from '@/components/ui/button';

interface ScrollButtonProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function ScrollButton({ targetId, children, className, size }: ScrollButtonProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Button size={size} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}

