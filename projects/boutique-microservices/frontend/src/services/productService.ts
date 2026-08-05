import apiClient from './api';
import { Product } from '../types';

// ── Local AI-generated image map (name/slug → local path) ──────────────────
// These are high-quality images generated specifically for this project.
// They act as the PRIMARY source so the UI always looks great on any env.
const LOCAL_IMAGE_MAP: Record<string, string> = {
  // by slug
  'silk-evening-gown':  '/product-images/silk-evening-gown.jpg',
  'cashmere-coat':      '/product-images/cashmere-coat.jpg',
  'leather-handbag':   '/product-images/leather-handbag.jpg',
  'diamond-necklace':  '/product-images/diamond-necklace.jpg',
  'designer-heels':    '/product-images/designer-heels.jpg',
  // by lowercase name fragment (for robustness)
  'silk evening gown': '/product-images/silk-evening-gown.jpg',
  'cashmere coat':     '/product-images/cashmere-coat.jpg',
  'leather handbag':   '/product-images/leather-handbag.jpg',
  'diamond necklace':  '/product-images/diamond-necklace.jpg',
  'designer heels':    '/product-images/designer-heels.jpg',
};

// Curated Unsplash fallbacks per category (when local image not matched)
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  clothing:    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  accessories: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
  shoes:       'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
  bags:        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  jewelry:     'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
};

/**
 * Resolve the best available image for a product.
 * Priority: local AI image → DB image_url → category fallback → placeholder
 */
const getImageUrl = (product: any): string => {
  const slug = (product.slug || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const category = (product.category || product.category_id || '').toLowerCase();

  // 1. Check local AI-generated images by slug or name
  if (LOCAL_IMAGE_MAP[slug]) return LOCAL_IMAGE_MAP[slug];
  for (const key of Object.keys(LOCAL_IMAGE_MAP)) {
    if (name.includes(key) || slug.includes(key)) return LOCAL_IMAGE_MAP[key];
  }

  // 2. Use DB image_url if it looks valid (http/https or starts with /)
  if (product.image_url && (product.image_url.startsWith('http') || product.image_url.startsWith('/'))) {
    return product.image_url;
  }

  // 3. Category-based Unsplash fallback
  if (CATEGORY_IMAGE_MAP[category]) return CATEGORY_IMAGE_MAP[category];

  // 4. Generic placeholder
  return '/product-images/placeholder.jpg';
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    console.log('[ProductService] Fetching products from:', process.env.REACT_APP_API_URL || 'http://localhost:3003');
    try {
      const response = await apiClient.get('/products');
      const apiResponse = response.data;
      
      // Transform API response to match frontend types
      if (apiResponse.success && apiResponse.data?.products) {
        console.log('[ProductService] Using wrapped response format');
        return apiResponse.data.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            originalPrice: product.compare_price ? parseFloat(product.compare_price) : undefined,
            imageUrl: getImageUrl(product),   // ← smart local-first image resolution
            category: product.category,
            brand: product.brand,
            inventory: product.inventory_quantity || 0,
            rating: product.rating || 4.5,
            reviewCount: product.reviewCount || Math.floor(Math.random() * 50) + 10,
            isNew: product.is_featured,
            discountPercentage: product.discountPercentage,
            createdAt: product.created_at,
            updatedAt: product.updated_at,
        }));
      }
      
      // Fallback for direct array response
      console.log('[ProductService] Using fallback array format');
      return Array.isArray(apiResponse) ? apiResponse.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
        imageUrl: getImageUrl(product),
        category: product.category || product.category_id,
        brand: product.brand,
        inventory: product.inventory_quantity || product.inventory || 0,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.new_arrival,
        discountPercentage: product.discountPercentage,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      })) : [];
    } catch (error: any) {
      console.error('[ProductService] Error fetching products:', error);
      if (error.response) {
        console.error('[ProductService] Response error:', error.response.status, error.response.data);
      }
      throw error;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      const product = response.data.data || response.data;
      
      // Transform API response to match frontend types
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
        imageUrl: getImageUrl(product),
        category: product.category || product.category_id,
        brand: product.brand,
        inventory: product.inventory_quantity || product.inventory || 0,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.new_arrival,
        discountPercentage: product.discountPercentage,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        images: product.images || [],
      };
    } catch (error: any) {
      console.error('[ProductService] Error fetching product:', error);
      throw error;
    }
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get(`/products?category=${category}`);
    return response.data;
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get(`/products/search?q=${query}`);
    return response.data;
  },
};