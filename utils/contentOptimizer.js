/**
 * Content optimization utilities to reduce DOM size
 */

// Clean and optimize HTML content
export const optimizeHTMLContent = (htmlContent) => {
  if (!htmlContent) return '';
  
  return htmlContent
    // Remove empty paragraphs
    .replace(/<p>\s*<\/p>/gi, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove unnecessary divs that only contain text
    .replace(/<div[^>]*>([^<]+)<\/div>/gi, '<p>$1</p>')
    // Remove empty divs
    .replace(/<div[^>]*>\s*<\/div>/gi, '')
    // Remove unnecessary spans
    .replace(/<span[^>]*>([^<]+)<\/span>/gi, '$1')
    // Clean up multiple line breaks
    .replace(/(\r?\n\s*){3,}/g, '\n\n')
    .trim();
};

// Limit content length to reduce DOM size
export const limitContentLength = (content, maxLength = 1000) => {
  if (!content) return '';
  
  const textContent = content.replace(/<[^>]*>/g, '');
  if (textContent.length <= maxLength) return content;
  
  // Find a good breaking point
  const truncated = textContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
};

// Extract text content for preview
export const extractTextContent = (htmlContent, maxLength = 200) => {
  if (!htmlContent) return '';
  
  const textContent = htmlContent
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (textContent.length <= maxLength) return textContent;
  
  return textContent.substring(0, maxLength) + '...';
};

// Optimize images in content
export const optimizeImagesInContent = (htmlContent) => {
  if (!htmlContent) return '';
  
  return htmlContent
    // Add loading="lazy" to images
    .replace(/<img([^>]*)>/gi, '<img$1 loading="lazy">')
    // Add alt attributes if missing
    .replace(/<img([^>]*?)(?<!alt=)[^>]*>/gi, '<img$1 alt="">');
};

// Create a lightweight content wrapper
export const createContentWrapper = (content, className = '') => {
  const optimizedContent = optimizeHTMLContent(content);
  return `<div class="${className}">${optimizedContent}</div>`;
}; 