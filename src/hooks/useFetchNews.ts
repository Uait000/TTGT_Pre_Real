import { useState, useEffect } from 'react';
import { BASE_URL, POSTS_ENDPOINT, NewsPost } from '@/api/config';

const DEFAULT_CATEGORY = 0;

export const useFetchNews = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = async (limit: number = 10, currentOffset: number) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
        const safeLimit = Number(limit);
        const safeOffset = Number(currentOffset);

        if (isNaN(safeLimit) || isNaN(safeOffset)) {
            throw new Error('Limit and offset must be valid numbers.');
        }

      const url = `${BASE_URL}${POSTS_ENDPOINT}?limit=${safeLimit}&offset=${safeOffset}&category=${DEFAULT_CATEGORY}`;

      const response = await fetch(url);

      if (!response.ok) {
            const errorDetails = await response.json().catch(() => ({ detail: response.statusText }));
            console.error('API Error:', errorDetails);
        throw new Error(`Failed to fetch news: ${errorDetails.detail || response.statusText}`);
      }

      const newPosts: NewsPost[] = await response.json();

      const normalizedPosts = newPosts.map(post => ({
        ...post,
        body: (post as any).text || post.body || '',
      }));

      setPosts(prev => [...prev, ...normalizedPosts]);
      setOffset(currentOffset + normalizedPosts.length);
      setHasMore(normalizedPosts.length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    setError(null);
    loadMore(9, 0);
  };

  useEffect(() => {
    loadMore(9, 0);
  }, []);

  return { posts, loading, offset, hasMore, loadMore, error, refresh };
};
