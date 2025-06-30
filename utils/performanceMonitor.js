/**
 * Performance monitoring utilities
 */

// Monitor DOM size
export const monitorDOMSize = () => {
  if (typeof window === 'undefined') return null;
  
  const totalElements = document.getElementsByTagName('*').length;
  const bodyElements = document.body.getElementsByTagName('*').length;
  
  // Calculate DOM depth
  const calculateDepth = (element, depth = 0) => {
    const children = element.children;
    if (children.length === 0) return depth;
    
    let maxDepth = depth;
    for (let i = 0; i < children.length; i++) {
      maxDepth = Math.max(maxDepth, calculateDepth(children[i], depth + 1));
    }
    return maxDepth;
  };
  
  const maxDepth = calculateDepth(document.body);
  
  return {
    totalElements,
    bodyElements,
    maxDepth,
    timestamp: Date.now()
  };
};

// Log performance warnings
export const logPerformanceWarnings = () => {
  const metrics = monitorDOMSize();
  if (!metrics) return;
  
  const warnings = [];
  
  if (metrics.totalElements > 800) {
    warnings.push(`High DOM size: ${metrics.totalElements} elements`);
  }
  
  if (metrics.maxDepth > 15) {
    warnings.push(`Deep DOM structure: ${metrics.maxDepth} levels`);
  }
  
  if (warnings.length > 0) {
    console.warn('Performance Warnings:', warnings.join(', '));
  }
  
  return warnings;
};

// Monitor layout performance
export const monitorLayoutPerformance = () => {
  if (typeof window === 'undefined') return;
  
  let layoutCount = 0;
  let lastTime = performance.now();
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift') {
        layoutCount++;
      }
    }
  });
  
  observer.observe({ entryTypes: ['layout-shift'] });
  
  // Log layout performance every 5 seconds
  setInterval(() => {
    const currentTime = performance.now();
    const timeDiff = currentTime - lastTime;
    
    if (layoutCount > 10) {
      console.warn(`High layout shifts: ${layoutCount} in ${Math.round(timeDiff)}ms`);
    }
    
    layoutCount = 0;
    lastTime = currentTime;
  }, 5000);
};

// Debounce function to reduce excessive re-renders
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 