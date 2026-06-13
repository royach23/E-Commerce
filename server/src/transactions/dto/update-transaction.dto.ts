export class UpdateTransactionDto {
  user_id?: number;
  total_price?: number;
  purchase_time?: string;
  order_status?: 'PENDING' | 'COMPLETED' | 'CANCELED';
}
