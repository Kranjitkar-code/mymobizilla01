const WORDPRESS_API_URL = import.meta.env.VITE_WORDPRESS_URL || 'http://localhost:8000/wp-json';

export interface WPPost {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  slug: string;
  date: string;
  modified: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
  acf?: Record<string, any>;
}

export interface WPService extends WPPost {
  acf?: {
    price?: number;
    duration?: string;
    icon?: string;
  };
}

export interface WPProduct extends WPPost {
  acf?: {
    price: number;
    sku?: string;
    in_stock: boolean;
    gallery?: string[];
  };
}

export async function fetchPosts(postType: string, params: Record<string, any> = {}): Promise<WPPost[]> {
  const query = new URLSearchParams({
    _embed: '1',
    ...params,
  }).toString();

  const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/${postType}?${query}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${postType}`);
  }

  return response.json();
}

export async function fetchPost(postType: string, id: string | number): Promise<WPPost> {
  const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/${postType}/${id}?_embed=1`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${postType} ${id}`);
  }

  return response.json();
}

export async function fetchServices(params: Record<string, any> = {}): Promise<WPService[]> {
  return fetchPosts('service', params) as unknown as WPService[];
}

export async function fetchService(id: string | number): Promise<WPService> {
  return fetchPost('service', id) as unknown as WPService;
}

export async function fetchProducts(params: Record<string, any> = {}): Promise<WPProduct[]> {
  return fetchPosts('product', params) as unknown as WPProduct[];
}

export async function fetchProduct(id: string | number): Promise<WPProduct> {
  return fetchPost('product', id) as unknown as WPProduct;
}

// Authentication functions for admin dashboard
export async function login(username: string, password: string) {
  const response = await fetch(`${WORDPRESS_API_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

export async function validateToken(token: string) {
  const response = await fetch(`${WORDPRESS_API_URL}/jwt-auth/v1/token/validate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Invalid token');
  }

  return response.json();
}

export async function createPost(postType: string, data: any, token: string) {
  const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/${postType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create post');
  }

  return response.json();
}

export async function updatePost(postType: string, id: number, data: any, token: string) {
  const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/${postType}/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update post');
  }

  return response.json();
}

export async function deletePost(postType: string, id: number, token: string) {
  const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/${postType}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete post');
  }

  return response.json();
}
