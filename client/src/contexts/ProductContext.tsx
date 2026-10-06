import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Product } from '../types/Product';
import { ProductService } from '../services/ProductService';
import { useLocation } from 'react-router-dom';


interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  searchProducts: (term: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'productId'>) => Promise<Product>;
  editProduct: (productId: number, product: Partial<Product>) => Promise<Product>;
  removeProduct: (productId: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await ProductService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const searchResults = await ProductService.searchProducts(term);
      setProducts(searchResults);
    } catch (err) {
      setError('Failed to search products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (newProductData: Omit<Product, 'productId'>): Promise<Product> => {
    const created = await ProductService.createProduct(newProductData);
    setProducts((prev) => [...prev, created]);
    return created;
  };

  const editProduct = async (productId: number, updatedData: Partial<Product>): Promise<Product> => {
    const updated = await ProductService.updateProduct(productId, updatedData);
    setProducts((prev) => prev.map((p) => (p.productId === productId ? updated : p)));
    return updated;
  };

  const removeProduct = async (productId: number): Promise<void> => {
    await ProductService.deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      fetchProducts();
    }
  }, [location.pathname]);

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      error, 
      fetchProducts, 
      searchProducts,
      addProduct,
      editProduct,
      removeProduct
    }}>
      {children}
    </ProductContext.Provider>
  );

};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};