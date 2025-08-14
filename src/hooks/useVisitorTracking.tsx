import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Generate a simple session ID
        const sessionId = sessionStorage.getItem('visitor_session') || 
          Math.random().toString(36).substring(2) + Date.now().toString(36);
        
        if (!sessionStorage.getItem('visitor_session')) {
          sessionStorage.setItem('visitor_session', sessionId);
        }

        // Track the visit with minimal privacy-respecting data
        await supabase
          .from('visitor_logs')
          .insert({
            page_path: window.location.pathname,
            session_id: sessionId,
            // Only track basic browser info, not full user agent
            user_agent: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
          });
      } catch (error) {
        // Silently fail to not disrupt user experience
        console.log('Visitor tracking failed:', error);
      }
    };

    trackVisitor();
  }, []);
};