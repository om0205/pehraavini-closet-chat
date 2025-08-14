-- Add missing DELETE policy for admin_invitations table
CREATE POLICY "Admins can delete invitations" 
ON public.admin_invitations 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'::text
  )
);