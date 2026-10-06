import axios from 'axios';
import { Product, mapProductsJsonToProduct, mapProductJsonToProduct } from '../types/Product';
import api from '../api/api'

const PRODUCT_URL = `/product`;

export const ProductService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await api.get(`${PRODUCT_URL}s`);
      return mapProductsJsonToProduct(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(productId: number): Promise<Product> {
    try {
      const response = await api.get(`${PRODUCT_URL}/${productId}`);
      return mapProductJsonToProduct(response.data);
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const response = await api.get(`${PRODUCT_URL}/search/${searchTerm}`);
      return mapProductsJsonToProduct(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          return [];
        } else {
          console.error("Error: No response received from server ", error);
        }
      } else {
        console.error('Error searching products:', error);
      }
      throw error;
    }
  },

  async createProduct(product: Omit<Product, 'productId'>): Promise<Product> {
    try {
      const payload = {
        name: product.name,
        description: product.description,
        price: product.price,
        in_stock: product.inStock,
        category: product.category,
        sizes: product.sizes,
        image: product.image,
      };
      const response = await api.post(PRODUCT_URL, payload);
      return mapProductJsonToProduct(response.data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(productId: number, product: Partial<Product>): Promise<Product> {
    try {
      const payload: Record<string, any> = {};
      if (product.name !== undefined) payload.name = product.name;
      if (product.description !== undefined) payload.description = product.description;
      if (product.price !== undefined) payload.price = product.price;
      if (product.inStock !== undefined) payload.in_stock = product.inStock;
      if (product.category !== undefined) payload.category = product.category;
      if (product.sizes !== undefined) payload.sizes = product.sizes;
      if (product.image !== undefined) payload.image = product.image;

      const response = await api.put(`${PRODUCT_URL}/${productId}`, payload);
      return mapProductJsonToProduct(response.data);
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw error;
    }
  },

  async deleteProduct(productId: number): Promise<void> {
    try {
      await api.delete(`${PRODUCT_URL}/${productId}`);
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      throw error;
    }
  },
};