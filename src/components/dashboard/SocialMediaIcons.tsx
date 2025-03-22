
import { Globe, Facebook, Instagram, Youtube, Baseline } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialMediaIconsProps {
  extendedData: any;
  className?: string;
}

export const SocialMediaIcons = ({ extendedData, className }: SocialMediaIconsProps) => {
  if (!extendedData) return null;
  
  const { websiteUrl, facebookUrl, instagramUrl, youtubeUrl, tiktokUrl } = extendedData;
  
  // If no social links are available, don't render anything
  if (!websiteUrl && !facebookUrl && !instagramUrl && !youtubeUrl && !tiktokUrl) {
    return null;
  }
  
  return (
    <div className={cn("flex gap-3", className)}>
      {websiteUrl && (
        <a 
          href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-brand-teal transition-colors"
        >
          <Globe className="h-5 w-5" />
        </a>
      )}
      
      {facebookUrl && (
        <a 
          href={facebookUrl.startsWith('http') ? facebookUrl : `https://${facebookUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Facebook className="h-5 w-5" />
        </a>
      )}
      
      {instagramUrl && (
        <a 
          href={instagramUrl.startsWith('http') ? instagramUrl : `https://${instagramUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-pink-600 transition-colors"
        >
          <Instagram className="h-5 w-5" />
        </a>
      )}
      
      {youtubeUrl && (
        <a 
          href={youtubeUrl.startsWith('http') ? youtubeUrl : `https://${youtubeUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          <Youtube className="h-5 w-5" />
        </a>
      )}
      
      {tiktokUrl && (
        <a 
          href={tiktokUrl.startsWith('http') ? tiktokUrl : `https://${tiktokUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-black transition-colors"
        >
          <Baseline className="h-5 w-5" />
        </a>
      )}
    </div>
  );
};
