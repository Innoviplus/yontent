/**
 * Formats a URL by ensuring it has the proper protocol prefix
 */
export const formatUrl = (url: string | undefined | null): string | null => {
  if (!url || url.trim() === '') return null;
  url = url.trim();
  
  // Check if the URL already starts with http:// or https://
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise prepend https://
  return `https://${url}`;
};
