import { useEffect, useRef, useState } from 'react';
import { measurePerformance } from '../utils/performanceTest';

export const usePerformanceMonitor = (componentName, dependencies = []) => {
  const [metrics, setMetrics] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const measureAndReport = () => {
      const performanceData = measurePerformance();
      if (!performanceData) return;

      setMetrics(performanceData);

      // Generate warnings
      const newWarnings = [];
      
      if (performanceData.totalElements > 800) {
        newWarnings.push(`High DOM size: ${performanceData.totalElements} elements`);
      }
      
      if (performanceData.maxDepth > 12) {
        newWarnings.push(`Deep DOM structure: ${performanceData.maxDepth} levels`);
      }
      
      if (performanceData.elementCounts.div > 200) {
        newWarnings.push(`Too many div elements: ${performanceData.elementCounts.div}`);
      }

      setWarnings(newWarnings);

      // Log to console
      console.group(`🔍 Performance Monitor: ${componentName}`);
      console.log('📊 Metrics:', performanceData);
      if (newWarnings.length > 0) {
        console.warn('⚠️ Warnings:', newWarnings);
      }
      console.groupEnd();
    };

    // Measure after a short delay to allow rendering
    const timeoutId = setTimeout(measureAndReport, 100);

    return () => clearTimeout(timeoutId);
  }, dependencies);

  return { metrics, warnings };
};

export const useDOMSizeTracker = () => {
  const [domSize, setDomSize] = useState(0);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    const trackDOMSize = () => {
      if (typeof window === 'undefined') return;
      
      const elements = document.getElementsByTagName('*');
      const size = elements.length;
      
      setDomSize(size);
      setIsOptimized(size < 800);
    };

    // Track on mount and after any DOM changes
    trackDOMSize();
    
    // Use MutationObserver to track DOM changes
    const observer = new MutationObserver(trackDOMSize);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return { domSize, isOptimized };
};

export const usePerformanceOptimizer = () => {
  const [optimizations, setOptimizations] = useState([]);

  const addOptimization = (optimization) => {
    setOptimizations(prev => [...prev, {
      ...optimization,
      timestamp: Date.now()
    }]);
  };

  const getOptimizationReport = () => {
    return {
      totalOptimizations: optimizations.length,
      recentOptimizations: optimizations.slice(-5),
      performanceImpact: optimizations.reduce((acc, opt) => acc + (opt.impact || 0), 0)
    };
  };

  return {
    optimizations,
    addOptimization,
    getOptimizationReport
  };
}; 