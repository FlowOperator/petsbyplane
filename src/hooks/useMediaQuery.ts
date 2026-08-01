import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

interface MediaQuery {
  /** Is viewport width below 480px (mobile phone) */
  isMobile: boolean;
  /** Is viewport width 481-768px (tablet) */
  isTablet: boolean;
  /** Is viewport width above 768px (desktop) */
  isDesktop: boolean;
  /** Current viewport width */
  width: number;
}

/**
 * Responsive breakpoint hook.
 * On native, always returns mobile. On web, tracks window resize.
 */
export function useMediaQuery(): MediaQuery {
  const [width, setWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  return {
    isMobile: width <= 480,
    isTablet: width > 480 && width <= 768,
    isDesktop: width > 768,
    width,
  };
}
