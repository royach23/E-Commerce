export interface Product {
    productId: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    sizes?: string[];
    inStock: boolean;
  }

  export interface ProductJson {
    product_id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    sizes?: string[];
    in_stock: boolean;
  }

  export function mapProductJsonToProduct(productJson: ProductJson): Product {
    return {
      productId: productJson.product_id,
      name: productJson.name,
      price: productJson.price,
      description: productJson.description,
      image: productJson.image,
      category: productJson.category,
      sizes: productJson.sizes,
      inStock: productJson.in_stock,
    };
  }

  export const mapProductsJsonToProduct =(productsJson: ProductJson[]): Product[] => {
    return productsJson.map((product) => (mapProductJsonToProduct(product)));
  }
  