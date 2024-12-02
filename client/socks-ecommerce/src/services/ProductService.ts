import axios from 'axios';
import { Product, mapProductsJsonToProduct } from '../types/Product';
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
  }
};