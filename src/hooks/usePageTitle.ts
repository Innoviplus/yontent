
import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `Yontent - ${title}`;
    return () => {
      document.title = 'Yontent Singapore'; // Reset to default on unmount
    };
  }, [title]);
};
