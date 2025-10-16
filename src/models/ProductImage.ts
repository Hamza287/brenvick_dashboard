export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  altText?: string | null;
  position: number;
}
