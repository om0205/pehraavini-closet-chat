import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Eye, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VisitorLog {
  id: string;
  visited_at: string;
  page_path: string;
  user_agent: string;
  session_id: string;
}

const fetchVisitorStats = async () => {
  // Get Monday of current week
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);
  monday.setHours(0, 0, 0, 0);

  const { data: weeklyData, error: weeklyError } = await supabase
    .from('visitor_logs')
    .select('*')
    .gte('visited_at', monday.toISOString());

  if (weeklyError) throw weeklyError;

  // Get unique sessions for this week
  const uniqueSessions = new Set(weeklyData?.map(log => log.session_id) || []);
  
  const { data: allTimeData, error: allTimeError } = await supabase
    .from('visitor_logs')
    .select('*')
    .order('visited_at', { ascending: false })
    .limit(100);

  if (allTimeError) throw allTimeError;

  return {
    weeklyVisits: weeklyData?.length || 0,
    weeklyUnique: uniqueSessions.size,
    recentLogs: allTimeData || []
  };
};

export const VisitorStats = () => {
  const [showLogs, setShowLogs] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['visitor-stats'],
    queryFn: fetchVisitorStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load visitor statistics. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateUserAgent = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Website Analytics</h2>
        <Button
          variant="outline"
          onClick={() => setShowLogs(!showLogs)}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showLogs ? 'Hide' : 'Show'} Visitor Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data?.weeklyVisits || 0}</div>
            <p className="text-xs text-muted-foreground">Resets every Monday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data?.weeklyUnique || 0}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Visitor Log */}
      {showLogs && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent Visitor Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data?.recentLogs.map((log: VisitorLog) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{log.page_path}</span>
                    <span className="text-muted-foreground">
                      {truncateUserAgent(log.user_agent)}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatDate(log.visited_at)}
                  </span>
                </div>
              ))}
              {(!data?.recentLogs || data.recentLogs.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No visitor logs found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};