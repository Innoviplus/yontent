
-- Storage buckets for receipt images
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true);

-- Add policy for users to upload receipts
create policy "Users can upload receipts" on storage.objects
  for insert
  with check (bucket_id = 'receipts' and auth.uid() = (storage.foldername(name))[1]::uuid);

-- Add policy for users to view their own receipts
create policy "Users can view their own receipts" on storage.objects
  for select
  using (bucket_id = 'receipts' and auth.uid() = (storage.foldername(name))[1]::uuid);

-- Add policy for admins to view all receipts
create policy "Admins can view all receipts" on storage.objects
  for select
  using (bucket_id = 'receipts' and auth.uid() in (
    select id from auth.users where auth.jwt() ->> 'role' = 'admin'
  ));
