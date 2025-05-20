
import { Globe, Facebook, Instagram, Youtube, Baseline } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialMediaIconsProps {
  user: any;
  className?: string;
}

export const SocialMediaIcons = ({ user, className }: SocialMediaIconsProps) => {
  if (!user) return null;
  
  console.log('SocialMediaIcons user data:', { 
    website: user.website_url, 
    facebook: user.facebook_url,
    instagram: user.instagram_url,
    youtube: user.youtube_url,
    tiktok: user.tiktok_url
  });
  
  const { website_url, facebook_url, instagram_url, youtube_url, tiktok_url } = user;
  
  // Check if any social URL has content
  const hasNoSocialLinks = !website_url?.trim() && 
                          !facebook_url?.trim() && 
                          !instagram_url?.trim() && 
                          !youtube_url?.trim() && 
                          !tiktok_url?.trim();
  
  // If no social links with content are available, don't render anything
  if (hasNoSocialLinks) {
    console.log('No social media links with content found');
    return null;
  }
  
  return (
    <div className={cn("flex gap-3", className)}>
      {website_url && website_url.trim() && (
        <a 
          href={website_url.startsWith('http') ? website_url : `https://${website_url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-brand-teal transition-colors"
        >
          <Globe className="h-5 w-5" />
        </a>
      )}
      
      {facebook_url && facebook_url.trim() && (
        <a 
          href={facebook_url.startsWith('http') ? facebook_url : `https://${facebook_url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Facebook className="h-5 w-5" />
        </a>
      )}
      
      {instagram_url && instagram_url.trim() && (
        <a 
          href={instagram_url.startsWith('http') ? instagram_url : `https://${instagram_url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-pink-600 transition-colors"
        >
          <Instagram className="h-5 w-5" />
        </a>
      )}
      
      {youtube_url && youtube_url.trim() && (
        <a 
          href={youtube_url.startsWith('http') ? youtube_url : `https://${youtube_url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-red-600 transition-colors"
        >
          <Youtube className="h-5 w-5" />
        </a>
      )}
      
      {tiktok_url && tiktok_url.trim() && (
        <a 
          href={tiktok_url.startsWith('http') ? tiktok_url : `https://${tiktok_url}`} 
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
