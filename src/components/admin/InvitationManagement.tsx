import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Copy, Trash2, Calendar, Mail, User } from "lucide-react";
import { format } from "date-fns";

interface Invitation {
  id: string;
  code: string;
  email: string | null;
  expires_at: string;
  used_at: string | null;
  used_by: string | null;
  created_at: string;
}

export const InvitationManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ["admin-invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invitation[];
    }
  });

  const createInvitationMutation = useMutation({
    mutationFn: async (email?: string) => {
      const code = await generateInvitationCode();
      const { data, error } = await supabase
        .from("admin_invitations")
        .insert({
          code,
          email: email || null,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invitations"] });
      toast.success("Invitation created successfully!");
      setIsCreateModalOpen(false);
      setEmail("");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteInvitationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("admin_invitations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-invitations"] });
      toast.success("Invitation deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const generateInvitationCode = async () => {
    const { data, error } = await supabase.rpc("generate_invitation_code");
    if (error) throw error;
    return data;
  };

  const copyInvitationLink = (code: string) => {
    const link = `${window.location.origin}/admin/invite-signup?code=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied to clipboard!");
  };

  const handleCreateInvitation = () => {
    createInvitationMutation.mutate(email || undefined);
  };

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.used_at) {
      return <Badge variant="secondary">Used</Badge>;
    }
    
    const isExpired = new Date(invitation.expires_at) < new Date();
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    return <Badge variant="default">Active</Badge>;
  };

  if (isLoading) {
    return <div>Loading invitations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Admin Invitations</CardTitle>
            <CardDescription>
              Manage admin invitation codes
            </CardDescription>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invitation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Admin Invitation</DialogTitle>
                <DialogDescription>
                  Generate a new invitation code for admin access. Optionally specify an email address.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    If specified, only this email can use the invitation code
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateInvitation}
                  disabled={createInvitationMutation.isPending}
                >
                  {createInvitationMutation.isPending ? "Creating..." : "Create Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations && invitations.length > 0 ? (
            invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {invitation.code}
                    </code>
                    {getStatusBadge(invitation)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {invitation.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {invitation.email}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expires: {format(new Date(invitation.expires_at), "MMM d, yyyy")}
                    </div>
                    {invitation.used_at && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Used: {format(new Date(invitation.used_at), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!invitation.used_at && new Date(invitation.expires_at) > new Date() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInvitationLink(invitation.code)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Link
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteInvitationMutation.mutate(invitation.id)}
                    disabled={deleteInvitationMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No invitations found. Create your first invitation to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};