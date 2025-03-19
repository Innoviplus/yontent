
-- Create storage bucket for missions if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('missions', 'missions')
ON CONFLICT (id) DO NOTHING;

-- Set up public access for the missions bucket
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Public Access',
  '{"version":"1","statement":[{"effect":"allow","principal":"*","action":"select","resource":"missions/*"}]}',
  'missions'
)
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Allow authenticated users to upload to the missions bucket
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES (
  'Authenticated Upload',
  '{"version":"1","statement":[{"effect":"allow","principal":{"jwt":{"sub":"*"}},"action":["insert","update"],"resource":"missions/*"}]}',
  'missions'
)
ON CONFLICT (name, bucket_id) DO NOTHING;
