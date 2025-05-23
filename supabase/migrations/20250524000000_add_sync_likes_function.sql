
-- Create function to synchronize review likes count
CREATE OR REPLACE FUNCTION public.sync_review_likes_count(review_id_param UUID)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  likes_count_val integer;
BEGIN
  -- Count the number of likes for this review
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
$function$;

-- Add a trigger to automatically sync like counts when review_likes changes
CREATE OR REPLACE FUNCTION public.sync_review_likes_count_on_change()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update the likes count for the affected review
    PERFORM sync_review_likes_count(NEW.review_id);
  ELSIF TG_OP = 'DELETE' THEN
    -- Update the likes count for the affected review
    PERFORM sync_review_likes_count(OLD.review_id);
  END IF;
  RETURN NULL;
END;
$function$;

-- Create the trigger
DROP TRIGGER IF EXISTS review_likes_change_trigger ON review_likes;

CREATE TRIGGER review_likes_change_trigger
AFTER INSERT OR DELETE ON review_likes
FOR EACH ROW
EXECUTE FUNCTION sync_review_likes_count_on_change();
