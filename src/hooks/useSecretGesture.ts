import { useCallback, useRef, useState } from 'react';

interface UseSecretGestureOptions {
  threshold?: number;
  onActivate: () => void;
}

interface GestureHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

interface UseSecretGestureReturn {
  handlers: GestureHandlers;
  isDragging: boolean;
  progress: number;
}

export function useSecretGesture({ 
  threshold = 100, 
  onActivate 
}: UseSecretGestureOptions): UseSecretGestureReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const startYRef = useRef<number | null>(null);
  const activatedRef = useRef(false);

  const handleStart = useCallback((y: number) => {
    startYRef.current = y;
    activatedRef.current = false;
    setIsDragging(true);
    setProgress(0);
  }, []);

  const handleMove = useCallback((y: number) => {
    if (startYRef.current === null || activatedRef.current) return;

    const distance = startYRef.current - y;
    const newProgress = Math.min(Math.max(distance / threshold, 0), 1);
    setProgress(newProgress);

    if (distance >= threshold) {
      activatedRef.current = true;
      setIsDragging(false);
      setProgress(0);
      startYRef.current = null;
      onActivate();
    }
  }, [threshold, onActivate]);

  const handleEnd = useCallback(() => {
    startYRef.current = null;
    setIsDragging(false);
    setProgress(0);
  }, []);

  const handlers: GestureHandlers = {
    onMouseDown: (e: React.MouseEvent) => handleStart(e.clientY),
    onMouseMove: (e: React.MouseEvent) => {
      if (isDragging) handleMove(e.clientY);
    },
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
    onTouchStart: (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        handleStart(e.touches[0].clientY);
      }
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        handleMove(e.touches[0].clientY);
      }
    },
    onTouchEnd: handleEnd,
  };

  return { handlers, isDragging, progress };
}
