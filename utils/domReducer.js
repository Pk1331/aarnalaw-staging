/**
 * DOM reduction utilities to minimize DOM elements
 */

// Lazy load components to reduce initial DOM size
export const lazyLoadComponent = (importFunc, fallback = null) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props) => (
    <React.Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// Memoize expensive components to prevent unnecessary re-renders
export const memoizeComponent = (Component, propsAreEqual = null) => {
  return React.memo(Component, propsAreEqual);
};

// Create a lightweight wrapper that reduces DOM nesting
export const createLightweightWrapper = (children, className = '') => {
  return React.createElement('div', { className }, children);
};

// Optimize list rendering with windowing
export const createWindowingList = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  return {
    visibleItems: items.slice(startIndex, endIndex),
    offsetY: startIndex * itemHeight,
    totalHeight: items.length * itemHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop)
  };
};

// Reduce DOM depth by flattening nested structures
export const flattenDOMStructure = (element, maxDepth = 3) => {
  if (!element || maxDepth <= 0) return element;
  
  const children = React.Children.toArray(element.props.children);
  const flattenedChildren = children.map(child => {
    if (React.isValidElement(child) && child.type === 'div') {
      return flattenDOMStructure(child, maxDepth - 1);
    }
    return child;
  });
  
  return React.cloneElement(element, {}, ...flattenedChildren);
};

// Create a minimal container component
export const MinimalContainer = ({ children, className = '', ...props }) => {
  return React.createElement('div', { className, ...props }, children);
};

// Optimize conditional rendering
export const ConditionalRender = ({ condition, children, fallback = null }) => {
  return condition ? children : fallback;
};

// Create a lightweight grid system
export const LightweightGrid = ({ children, cols = 1, gap = 4, className = '' }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${gap * 0.25}rem`
  };
  
  return React.createElement('div', { style: gridStyle, className }, children);
};

// Optimize image loading to reduce layout shifts
export const OptimizedImage = ({ src, alt, width, height, className = '', priority = false }) => {
  return React.createElement('img', {
    src,
    alt,
    width,
    height,
    className,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async'
  });
};

// Create a minimal text component
export const MinimalText = ({ children, as = 'p', className = '', ...props }) => {
  return React.createElement(as, { className, ...props }, children);
};

// Optimize button rendering
export const MinimalButton = ({ children, onClick, className = '', ...props }) => {
  return React.createElement('button', { onClick, className, ...props }, children);
};

// Create a lightweight link component
export const MinimalLink = ({ href, children, className = '', ...props }) => {
  return React.createElement('a', { href, className, ...props }, children);
}; 