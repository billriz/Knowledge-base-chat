-- Fix document search retrieval.
--
-- pgvector's <=> operator returns cosine distance, where smaller is better.
-- Convert it to cosine similarity with 1 - distance so the 0.7 threshold can
-- actually match relevant chunks. Also avoid naming the query embedding
-- parameter "embedding", because that conflicts with document_chunks.embedding.
DROP FUNCTION IF EXISTS search_document_chunks(vector, float, int);

CREATE FUNCTION search_document_chunks(
  query_embedding vector(1536),
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
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE 1 - (dc.embedding <=> query_embedding) > similarity_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
