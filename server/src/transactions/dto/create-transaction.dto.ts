export class CreateTransactionDto {
  user_id!: number;
  total_price!: number;
  purchase_time?: string;
}
