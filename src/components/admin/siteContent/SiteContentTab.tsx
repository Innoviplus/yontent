
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

type SiteContentType = {
  id: string;
  type: string;
  title: string;
  content: string;
  updated_at: string;
};

const SiteContentTab = () => {
  const [activeTab, setActiveTab] = useState('privacy_policy');
  const [editedContent, setEditedContent] = useState('');
  const queryClient = useQueryClient();
  
  // Fetch site content
  const { data: siteContent, isLoading, error } = useQuery({
    queryKey: ['site-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .in('type', ['privacy_policy', 'terms_of_service']);
      
      if (error) throw error;
      return data as SiteContentType[];
    }
  });
  
  // Set initial content when data loads or tab changes
  useEffect(() => {
    if (siteContent && siteContent.length > 0) {
      const currentContent = siteContent.find(item => item.type === activeTab);
      if (currentContent) {
        setEditedContent(currentContent.content);
      }
    }
  }, [siteContent, activeTab]);
  
  // Update content mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      const currentContent = siteContent?.find(item => item.type === activeTab);
      if (!currentContent) throw new Error("Content not found");
      
      const { data, error } = await supabase
        .from('site_content')
        .update({ content: editedContent, updated_at: new Date().toISOString() })
        .eq('id', currentContent.id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Content updated successfully');
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      queryClient.invalidateQueries({ queryKey: [activeTab] });
    },
    onError: (error) => {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  });
  
  const handleSave = () => {
    updateMutation.mutate();
  };
  
  const getTabContent = (type: string) => {
    return siteContent?.find(item => item.type === type)?.content || '';
  };
  
  const getContentTitle = (type: string) => {
    return siteContent?.find(item => item.type === type)?.title || '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Content</h3>
          <p className="text-gray-600">
            There was a problem loading the site content. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Site Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="privacy_policy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms_of_service">Terms of Service</TabsTrigger>
          </TabsList>
          
          <TabsContent value="privacy_policy" className="space-y-4">
            <h2 className="text-2xl font-semibold">{getContentTitle('privacy_policy')}</h2>
            <RichTextEditor
              value={editedContent}
              onChange={setEditedContent}
              placeholder="Enter privacy policy content..."
              className="min-h-[500px]"
            />
          </TabsContent>
          
          <TabsContent value="terms_of_service" className="space-y-4">
            <h2 className="text-2xl font-semibold">{getContentTitle('terms_of_service')}</h2>
            <RichTextEditor
              value={editedContent}
              onChange={setEditedContent}
              placeholder="Enter terms of service content..."
              className="min-h-[500px]"
            />
          </TabsContent>
          
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="px-6"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SiteContentTab;
