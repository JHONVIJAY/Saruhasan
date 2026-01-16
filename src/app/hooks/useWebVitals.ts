import { useEffect } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export function useWebVitals(onMetric?: (metric: WebVitalsMetric) => void) {
  useEffect(() => {
    // Only run in production for actual metrics
    if (typeof window === 'undefined') return;

    const handleMetric = (metric: WebVitalsMetric) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        });
      }

      // Call custom handler if provided
      onMetric?.(metric);

      // You can send to analytics here
      // Example: gtag('event', metric.name, { value: metric.value });
    };

    // Import web-vitals dynamically to reduce initial bundle
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(handleMetric as any);
      onFCP(handleMetric as any);
      onLCP(handleMetric as any);
      onTTFB(handleMetric as any);
      onINP(handleMetric as any); // INP replaced FID in web-vitals v3+
    }).catch((err) => {
      console.warn('Failed to load web-vitals:', err);
    });
  }, [onMetric]);
}