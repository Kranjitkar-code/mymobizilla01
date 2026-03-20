import { useEffect } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  QueryKey,
  QueryClient
} from '@tanstack/react-query';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  UpdateData,
  DocumentReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Create a single instance of QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Helper function to convert Firestore document to typed object
function docToData<T extends DocumentData>(
  doc: QueryDocumentSnapshot | DocumentSnapshot
): T {
  const data = doc.data() || {};
  return {
    id: doc.id,
    ...data
  } as unknown as T;
}

// Type for collection query options
interface CollectionQueryOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  limit?: number; // Alias for limitCount for backward compatibility
  enabled?: boolean;
}

// Base type for all documents that includes the id field
type FirestoreDocument = {
  id?: string; // Optional because new documents won't have an ID yet
  [key: string]: any;
};

// Generic hook for fetching a single document
export function useDocument<T extends FirestoreDocument>(
  collectionName: string, 
  id: string,
  enabled = true
) {
  return useQuery<T, Error>({
    queryKey: [collectionName, id] as QueryKey,
    queryFn: async (): Promise<T> => {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }
      return docToData<T>(docSnap);
    },
    enabled
  });
}

// Generic hook for fetching a collection
export function useCollection<T extends FirestoreDocument>(
  collectionName: string, 
  filters: Record<string, unknown> = {},
  options: CollectionQueryOptions = {}
) {
  const { orderByField, orderDirection = 'asc', limitCount, limit: limitValue = limitCount, enabled = true } = options;
  
  return useQuery<T[], Error>({
    queryKey: [collectionName, filters, orderByField, orderDirection, limitValue || limitCount] as QueryKey,
    queryFn: async (): Promise<T[]> => {
      let q = query(collection(db, collectionName));
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          q = query(q, where(key, '==', value));
        }
      });
      
      // Apply ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      // Apply limit
      if (limitValue) {
        q = query(q, limit(limitValue));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => docToData<T>(doc));
    },
    enabled
  });
}

// Real-time collection listener
export function useRealtimeCollection<T extends FirestoreDocument>(
  collectionName: string,
  onUpdate: (data: T[]) => void,
  options: CollectionQueryOptions = {}
) {
  const { orderByField, orderDirection = 'asc', limitCount, limit: limitValue = limitCount } = options;
  
  useEffect(() => {
    let q = query(collection(db, collectionName));
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    if (limitValue) {
      q = query(q, limit(limitValue));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => docToData<T>(doc));
      onUpdate(data);
    });
    
    return () => unsubscribe();
  }, [collectionName, orderByField, orderDirection, limitCount, onUpdate]);
}

// Mutation for adding/updating a document
export function useMutateDocument<T extends FirestoreDocument>(
  collectionName: string
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: T): Promise<T> => {
      const { id, ...rest } = data;
      
      if (id) {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, rest as UpdateData<DocumentData>);
        return { id, ...rest } as T;
      } else {
        const docRef = doc(collection(db, collectionName));
        await setDoc(docRef, rest);
        return { id: docRef.id, ...rest } as T;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
    }
  });
}

// Mutation for deleting a document
export function useDeleteDocument(collectionName: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
    }
  });
}

// Example usage with our collections
export interface Product extends DocumentData {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  category?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export function useProducts(options: {
  filters?: ProductFilters;
  orderByField?: keyof Product;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  enabled?: boolean;
} = {}) {
  const { filters, orderByField, orderDirection, limitCount, enabled = true } = options;
  
  // Convert filters to Firestore query format
  const queryFilters: Record<string, unknown> = {};
  
  if (filters) {
    if (filters.category) {
      queryFilters.category = filters.category;
    }
    
    if (filters.inStock !== undefined) {
      queryFilters.stock = filters.inStock ? '> 0' : '== 0';
    }
    
    if (filters.minPrice !== undefined) {
      queryFilters.price = ['>=', filters.minPrice];
    }
    
    if (filters.maxPrice !== undefined) {
      queryFilters.price = queryFilters.price 
        ? [queryFilters.price[0], queryFilters.price[1], '<=', filters.maxPrice]
        : ['<=', filters.maxPrice];
    }
  }
  
  return useCollection<Product>(
    'products', 
    queryFilters, 
    { 
      orderByField: orderByField as string, 
      orderDirection, 
      limitCount,
      enabled
    }
  );
}

export function useProduct(id: string, enabled = true) {
  return useDocument<Product>('products', id, enabled);
}

export function useMutateProduct() {
  return useMutateDocument<Product>('products');
}

export function useDeleteProduct() {
  return useDeleteDocument('products');
}
