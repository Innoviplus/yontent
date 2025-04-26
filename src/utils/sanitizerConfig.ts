
// Configuration object for DOMPurify sanitization
export const sanitizerConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'b', 'i', 'u', 'strong', 'em', 'strike', 'a', 'ul', 'ol', 'li',
    'blockquote', 'pre', 'code'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  ALLOWED_STYLES: [
    'color', 'background-color', 'text-align', 'font-size',
    'font-family', 'margin', 'padding', 'text-decoration'
  ],
  ADD_ATTR: ['target'],  // Allow target attribute (for _blank links)
  FORCE_HTTPS: true,     // Convert http to https for security
  RETURN_DOM: false,     // Return HTML as string
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false
};
