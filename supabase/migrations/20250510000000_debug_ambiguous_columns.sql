
-- Function to help debug ambiguous column references
CREATE OR REPLACE FUNCTION public.debug_query_columns(query_text TEXT)
RETURNS TABLE (
  schema_name TEXT,
  table_name TEXT,
  column_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH query_tables AS (
    -- This extracts table names from a simple query format
    -- In practice, this would need to be more sophisticated for complex queries
    SELECT regexp_split_to_table(query_text, E'\\s+from\\s+|\\s+join\\s+') AS table_ref
    WHERE query_text ~* 'from|join'
  ),
  clean_tables AS (
    -- Extract just the table name, removing aliases and schema prefixes for simplicity
    SELECT 
      CASE 
        WHEN table_ref LIKE '%.%' THEN split_part(table_ref, '.', 1)
        ELSE 'public'
      END AS schema_name,
      CASE
        WHEN table_ref LIKE '%.%' THEN split_part(table_ref, '.', 2) 
        ELSE table_ref
      END AS table_name
    FROM query_tables
    WHERE table_ref NOT LIKE '%WHERE%' AND table_ref NOT LIKE '%select%'
  )
  SELECT 
    t.schema_name,
    t.table_name,
    c.column_name
  FROM clean_tables t
  JOIN information_schema.columns c 
    ON (c.table_schema = t.schema_name OR t.schema_name IS NULL)
    AND c.table_name = t.table_name
  WHERE c.column_name = 'user_id'
  ORDER BY t.schema_name, t.table_name, c.column_name;
END;
$$ LANGUAGE plpgsql;

-- Create a helper function to explicitly identify all tables with user_id columns
CREATE OR REPLACE FUNCTION public.list_all_tables_with_user_id()
RETURNS TABLE (
  table_schema TEXT,
  table_name TEXT,
  column_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.table_schema, 
    c.table_name, 
    c.column_name
  FROM 
    information_schema.columns c
  WHERE 
    c.column_name = 'user_id'
    AND c.table_schema NOT IN ('information_schema', 'pg_catalog')
  ORDER BY 
    c.table_schema, 
    c.table_name;
END;
$$ LANGUAGE plpgsql;

-- Output diagnostic information
DO $$
BEGIN
  RAISE NOTICE 'Tables with user_id column:';
  FOR r IN SELECT * FROM list_all_tables_with_user_id() LOOP
    RAISE NOTICE '%: %.%', r.column_name, r.table_schema, r.table_name;
  END LOOP;
END $$;
