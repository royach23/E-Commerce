export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  in_stock?: boolean;
  category?: 'CASUAL' | 'WINTER' | 'FORMAL' | 'SPORTS' | null;
  sizes?: ('SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE')[] | null;
  image?: string | null;
}
