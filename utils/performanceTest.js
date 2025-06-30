/**
 * Performance testing utilities for measuring DOM improvements
 */

// Enhanced performance monitoring with component analysis
export const measurePerformance = () => {
  if (typeof document === 'undefined') return null;
  
  const startTime = performance.now();
  
  const elements = document.getElementsByTagName('*');
  const totalElements = elements.length;
  
  // Calculate DOM depth
  function calculateDepth(element, depth = 0) {
    const children = element.children;
    if (children.length === 0) return depth;
    
    let maxDepth = depth;
    for (let i = 0; i < children.length; i++) {
      maxDepth = Math.max(maxDepth, calculateDepth(children[i], depth + 1));
    }
    return maxDepth;
  }
  
  const maxDepth = calculateDepth(document.body);
  
  // Count elements by tag
  const elementCounts = {};
  for (let i = 0; i < elements.length; i++) {
    const tag = elements[i].tagName.toLowerCase();
    elementCounts[tag] = (elementCounts[tag] || 0) + 1;
  }
  
  // Analyze component structure
  const componentAnalysis = analyzeComponentStructure();
  
  const measurementTime = performance.now() - startTime;
  
  return {
    totalElements,
    maxDepth,
    elementCounts,
    componentAnalysis,
    measurementTime
  };
};

// Analyze component structure to identify heavy components
const analyzeComponentStructure = () => {
  const analysis = {
    heavyComponents: [],
    recommendations: []
  };
  
  // Check for components with many divs
  const divs = document.querySelectorAll('div');
  const divCounts = {};
  
  divs.forEach(div => {
    const className = div.className || 'no-class';
    const key = className.split(' ')[0]; // Get first class name
    divCounts[key] = (divCounts[key] || 0) + 1;
  });
  
  // Find components with excessive divs
  Object.entries(divCounts).forEach(([className, count]) => {
    if (count > 20) {
      analysis.heavyComponents.push({
        type: 'excessive-divs',
        className,
        count,
        recommendation: `Consider flattening structure in ${className}`
      });
    }
  });
  
  // Check for deep nesting
  const deepElements = document.querySelectorAll('*');
  deepElements.forEach(element => {
    let depth = 0;
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      depth++;
      parent = parent.parentElement;
    }
    
    if (depth > 15) {
      const className = element.className || 'no-class';
      analysis.heavyComponents.push({
        type: 'deep-nesting',
        className,
        depth,
        recommendation: `Reduce nesting depth in ${className}`
      });
    }
  });
  
  // Generate recommendations
  if (divCounts['grid'] > 50) {
    analysis.recommendations.push('Consider virtual scrolling for grid components');
  }
  
  if (divCounts['flex'] > 30) {
    analysis.recommendations.push('Optimize flex layouts to reduce wrapper divs');
  }
  
  return analysis;
};

// Compare performance before and after optimizations
export const comparePerformance = (before, after) => {
  if (!before || !after) return null;
  
  const elementReduction = before.totalElements - after.totalElements;
  const depthReduction = before.maxDepth - after.maxDepth;
  const elementReductionPercent = ((elementReduction / before.totalElements) * 100).toFixed(2);
  const depthReductionPercent = ((depthReduction / before.maxDepth) * 100).toFixed(2);
  
  return {
    elementReduction,
    elementReductionPercent,
    depthReduction,
    depthReductionPercent,
    improvement: elementReduction > 0 ? 'Improved' : 'No improvement'
  };
};

// Generate performance report
export const generatePerformanceReport = () => {
  const metrics = measurePerformance();
  if (!metrics) return null;
  
  const report = {
    summary: {
      totalElements: metrics.totalElements,
      maxDepth: metrics.maxDepth,
      measurementTime: `${metrics.measurementTime.toFixed(2)}ms`
    },
    topElements: Object.entries(metrics.elementCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count })),
    heavyComponents: metrics.componentAnalysis.heavyComponents,
    recommendations: [
      ...metrics.componentAnalysis.recommendations,
      ...generateGeneralRecommendations(metrics)
    ]
  };
  
  return report;
};

// Generate general recommendations based on metrics
const generateGeneralRecommendations = (metrics) => {
  const recommendations = [];
  
  if (metrics.totalElements > 800) {
    recommendations.push('Consider implementing virtual scrolling for large lists');
  }
  
  if (metrics.maxDepth > 12) {
    recommendations.push('Reduce nested component depth');
  }
  
  if (metrics.elementCounts.div > 200) {
    recommendations.push('Consider using semantic HTML elements instead of divs');
  }
  
  if (metrics.elementCounts.img > 50) {
    recommendations.push('Implement lazy loading for images below the fold');
  }
  
  return recommendations;
};

// Log performance report to console
export const logPerformanceReport = () => {
  const report = generatePerformanceReport();
  if (!report) return;
  
  console.group('🚀 Performance Report');
  console.log('📊 Summary:', report.summary);
  console.log('🏷️ Top Elements:', report.topElements);
  
  if (report.recommendations.length > 0) {
    console.log('💡 Recommendations:', report.recommendations);
  }
  
  console.groupEnd();
  
  return report;
}; 