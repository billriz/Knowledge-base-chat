-- Create the search_document_chunks RPC function
CREATE OR REPLACE FUNCTION search_document_chunks(
  embedding vector(1536),
  similarity_threshold float DEFAULT 0.7,
  result_limit int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  chunk_text TEXT,
  chunk_index INTEGER,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.chunk_text,
    dc.chunk_index,
    (dc.embedding <=> embedding) * -1 AS similarity
  FROM document_chunks dc
  WHERE (dc.embedding <=> embedding) * -1 > similarity_threshold
  ORDER BY (dc.embedding <=> embedding)
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
