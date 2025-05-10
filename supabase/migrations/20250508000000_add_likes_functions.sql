
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

-- Create function to sync likes count based on actual likes in the review_likes table
CREATE OR REPLACE FUNCTION sync_review_likes_count(review_id_param UUID)
RETURNS integer AS $$
DECLARE
  likes_count_val integer;
BEGIN
  -- Count the number of likes for this review with updated column name
  SELECT COUNT(*) INTO likes_count_val
  FROM review_likes
  WHERE review_id = review_id_param;
  
  -- Update the reviews table with the correct count
  UPDATE reviews
  SET likes_count = likes_count_val
  WHERE id = review_id_param;
  
  -- Return the updated count
  RETURN likes_count_val;
END;
$$ LANGUAGE plpgsql;
