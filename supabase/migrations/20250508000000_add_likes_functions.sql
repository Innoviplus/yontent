
-- Create function to increment review likes count
CREATE OR REPLACE FUNCTION increment_review_likes(review_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE reviews
  SET likes_count = likes_count + 1
  WHERE id = review_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement review likes count
CREATE OR REPLACE FUNCTION decrement_review_likes(review_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE reviews
  SET likes_count = GREATEST(0, likes_count - 1)  -- Ensure likes_count never goes below 0
  WHERE id = review_id_param;
END;
$$ LANGUAGE plpgsql;
