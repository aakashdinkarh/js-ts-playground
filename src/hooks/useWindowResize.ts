import { useState, useEffect } from 'react';
import { useDebounce } from '@hooks/useDebounce';
import { APP_CONSTANTS } from '@constants/app';

interface Dimensions {
  width: number;
  height: number;
}

interface UseWindowResizeReturn {
  dimensions: Dimensions;
  editorKey: number;
}

export const useWindowResize = (): UseWindowResizeReturn => {
  const [editorKey, setEditorKey] = useState<number>(0);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Debounced window resize handler
  const debouncedHandleResize = useDebounce(() => {
    const newDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Check if the size change is significant enough
    const widthDiff = Math.abs(newDimensions.width - dimensions.width);
    const heightDiff = Math.abs(newDimensions.height - dimensions.height);

    const wasMobile = dimensions.width < APP_CONSTANTS.MOBILE_BREAKPOINT;
    const isMobile = newDimensions.width < APP_CONSTANTS.MOBILE_BREAKPOINT;
    const breakpointChanged = wasMobile !== isMobile;

    if (widthDiff > APP_CONSTANTS.DIMENSION_CHANGE_THRESHOLD || 
        heightDiff > APP_CONSTANTS.DIMENSION_CHANGE_THRESHOLD || 
        breakpointChanged) {
      setDimensions(newDimensions);
      setEditorKey(prev => prev + 1); // Force remount
    }
  }, 250); // Wait for resize to finish

  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize);
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, [dimensions, debouncedHandleResize]);

  return { dimensions, editorKey };
}; 