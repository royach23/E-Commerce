import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { Product } from '../../types/Product';

interface DeleteProductDialogProps {
  open: boolean;
  product: Product | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  open,
  product,
  loading,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>
        Delete Product
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete product <strong>"{product?.name}"</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          Note: If this product has historical orders associated with it, it cannot be permanently deleted from the database to preserve customer receipts, and should be marked as Out of Stock instead.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductDialog;
