import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Collapse,
  Box,
  Table,
  TableHead,
  TableBody,
  SelectChangeEvent
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon
} from '@mui/icons-material';
import { Transaction } from '../../types/Transaction';

interface TransactionRowProps {
  transaction: Transaction;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (transactionId: number, newStatus: string) => Promise<void>;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction: tx,
  isExpanded,
  onToggleExpand,
  onStatusChange
}) => {
  const getStatusChipColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
      case 'PENDING':
        return { bg: '#fff3e0', color: '#e65100', border: '#ffb74d' };
      case 'CANCELED':
        return { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' };
      default:
        return { bg: '#f5f5f5', color: '#616161', border: '#e0e0e0' };
    }
  };

  const statusColors = getStatusChipColor(tx.orderStatus);
  const itemsCount = tx.cart?.items?.reduce((sum, it) => sum + it.quantity, 0) || 0;

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: 40 }}>
          <IconButton size="small" onClick={onToggleExpand}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
          #{tx.transactionId}
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {new Date(tx.purchaseTime).toLocaleString()}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ maxWidth: 180 }} noWrap title={tx.userId}>
            {tx.userId}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip label={`${itemsCount} item${itemsCount === 1 ? '' : 's'}`} size="small" variant="outlined" />
        </TableCell>
        <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.05rem' }}>
          ${(tx.cart?.total || 0).toFixed(2)}
        </TableCell>
        <TableCell>
          <Chip
            label={tx.orderStatus.toUpperCase()}
            size="small"
            sx={{
              bgcolor: statusColors.bg,
              color: statusColors.color,
              border: `1px solid ${statusColors.border}`,
              fontWeight: 'bold'
            }}
          />
        </TableCell>
        <TableCell>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={tx.orderStatus.toUpperCase()}
              onChange={(e: SelectChangeEvent) => onStatusChange(tx.transactionId, e.target.value)}
              sx={{ fontSize: '0.85rem', fontWeight: 'bold', borderRadius: 1.5 }}
            >
              <MenuItem value="PENDING" sx={{ color: '#e65100', fontWeight: 'bold' }}>
                PENDING
              </MenuItem>
              <MenuItem value="COMPLETED" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                COMPLETED
              </MenuItem>
              <MenuItem value="CANCELED" sx={{ color: '#c62828', fontWeight: 'bold' }}>
                CANCELED
              </MenuItem>
            </Select>
          </FormControl>
        </TableCell>
      </TableRow>

      {/* Expanded items */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, p: 2, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'primary.main' }}>
                Order Items Breakdown:
              </Typography>
              {(!tx.cart?.items || tx.cart.items.length === 0) ? (
                <Typography variant="body2" color="text.secondary">
                  No items recorded for this order.
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Size</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tx.cart.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 34, height: 34, borderRadius: 1, objectFit: 'cover' }}
                            onError={(e: any) => {
                              e.target.src = 'https://placehold.co/100x100?text=Sock';
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TransactionRow;
