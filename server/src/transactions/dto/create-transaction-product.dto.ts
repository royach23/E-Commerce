export class CreateTransactionProductDto {
  product_id!: number;
  quantity!: number;
  size!: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
}
