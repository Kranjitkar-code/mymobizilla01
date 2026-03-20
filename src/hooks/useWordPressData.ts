import { useState, useEffect, useCallback } from 'react';
import { 
  fetchServices, 
  fetchService, 
  fetchProducts, 
  fetchProduct, 
  createPost, 
  updatePost, 
  deletePost,
  WPPost,
  WPService,
  WPProduct
} from '@/lib/wordpress';

interface UseWordPressDataOptions {
  postType: 'service' | 'product' | 'post' | 'page';
  id?: string | number;
  params?: Record<string, any>;
  autoFetch?: boolean;
}

export function useWordPressData<T = WPPost>({
  postType,
  id,
  params = {},
  autoFetch = true
}: UseWordPressDataOptions) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!autoFetch) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (id) {
        // Fetch single item
        if (postType === 'service') {
          result = await fetchService(id);
        } else if (postType === 'product') {
          result = await fetchProduct(id);
        } else {
          throw new Error(`Unsupported post type: ${postType}`);
        }
        setData(result as T);
      } else {
        // Fetch collection
        if (postType === 'service') {
          result = await fetchServices(params);
        } else if (postType === 'product') {
          result = await fetchProducts(params);
        } else {
          throw new Error(`Unsupported post type: ${postType}`);
        }
        setData(result as T[]);
      }
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching ${postType} data:`, err);
    } finally {
      setLoading(false);
    }
  }, [postType, id, params, autoFetch]);

  const create = useCallback(async (newData: Omit<T, 'id'>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('wpToken');
      if (!token) throw new Error('Authentication required');
      
      const result = await createPost(postType, newData, token);
      await fetchData(); // Refresh data
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [postType, fetchData]);

  const update = useCallback(async (id: number, updatedData: Partial<T>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('wpToken');
      if (!token) throw new Error('Authentication required');
      
      const result = await updatePost(postType, id, updatedData, token);
      await fetchData(); // Refresh data
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [postType, fetchData]);

  const remove = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('wpToken');
      if (!token) throw new Error('Authentication required');
      
      await deletePost(postType, id, token);
      await fetchData(); // Refresh data
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [postType, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    delete: remove,
  };
}

// Specific hooks for common use cases
export function useServices(params?: Record<string, any>) {
  return useWordPressData<WPService>({
    postType: 'service',
    params,
  });
}

export function useService(id: string | number) {
  return useWordPressData<WPService>({
    postType: 'service',
    id,
  });
}

export function useProducts(params?: Record<string, any>) {
  return useWordPressData<WPProduct>({
    postType: 'product',
    params,
  });
}

export function useProduct(id: string | number) {
  return useWordPressData<WPProduct>({
    postType: 'product',
    id,
  });
}
