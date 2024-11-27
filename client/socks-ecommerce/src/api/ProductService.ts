import axios from 'axios';
import { Product } from '../types/Product';

const BASE_URL = 'http://127.0.0.1:8000/product';

export const ProductService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(`${BASE_URL}s`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${BASE_URL}/search/${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};