import { useState, useEffect } from 'react';
import { postsApi, Post, PostCategory } from '@/api/posts';

export const useFetchNews = (category: PostCategory) => {
	const [posts, setPosts] = useState<Post[]>([]); 
	const [loading, setLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const loadMore = async (limit: number = 10, currentOffset: number) => {
		
		if (loading || !hasMore) return; 

		setLoading(true);
		setError(null);

		try {
			const safeLimit = Number(limit);
			const safeOffset = Number(currentOffset);

			if (isNaN(safeLimit) || isNaN(safeOffset)) {
				throw new Error('Limit and offset must be valid numbers.');
			}

			const newPosts: Post[] = await postsApi.getPublicAll({
				limit: safeLimit,
				offset: safeOffset,
				category: category, 
			});

			
			const normalizedPosts = newPosts.map(post => ({
				...post,
				body: (post as any).text || post.body || '',
			}));

			
			setPosts(prev => (currentOffset === 0 ? normalizedPosts : [...prev, ...normalizedPosts]));
			setOffset(currentOffset + normalizedPosts.length);
			setHasMore(normalizedPosts.length === limit);

		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred';
			setError(errorMessage);
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
		
		setPosts([]);
		setOffset(0);
		setHasMore(true);
		setError(null);
		loadMore(9, 0); 
	}, [category]); 

	return { posts, loading, offset, hasMore, loadMore, error, refresh };
};