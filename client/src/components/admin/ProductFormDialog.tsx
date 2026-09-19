import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Switch,
  Typography,
  Box,
  Button,
  Grid2,
  Chip,
  CircularProgress
} from '@mui/material';
import { Product } from '../../types/Product';

const CATEGORIES = ['Casual', 'Winter', 'Formal', 'Sports'];
const SIZES = ['S', 'M', 'L', 'XL'];
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&auto=format&fit=crop&q=60';

interface ProductFormDialogProps {
  open: boolean;
  product: Product | null;
  loading: boolean;
  onClose: () => void;
  onSave: (formData: Omit<Product, 'productId'>) => Promise<void>;
}

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  product,
  loading,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Casual',
    sizes: ['M'] as string[],
    inStock: true,
    image: DEFAULT_IMAGE
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category || 'Casual',
        sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['M'],
        inStock: product.inStock,
        image: product.image || DEFAULT_IMAGE
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Casual',
        sizes: ['M'],
        inStock: true,
        image: DEFAULT_IMAGE
      });
    }
  }, [product, open]);

  const handleSubmit = async () => {
    const priceNum = parseFloat(formData.price);
    if (!formData.name.trim() || !formData.description.trim() || isNaN(priceNum) || priceNum <= 0) {
      return;
    }

    await onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: priceNum,
      category: formData.category,
      sizes: formData.sizes,
      inStock: formData.inStock,
      image: formData.image.trim() || DEFAULT_IMAGE
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {product ? `Edit Product #${product.productId}` : 'Add New Product'}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            label="Product Name *"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Price ($) *"
                type="number"
                fullWidth
                inputProps={{ step: '0.01', min: '0.01' }}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>

          <FormControl fullWidth>
            <InputLabel>Available Sizes</InputLabel>
            <Select
              multiple
              value={formData.sizes}
              onChange={(e) => {
                const val = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                setFormData({ ...formData, sizes: val });
              }}
              input={<OutlinedInput label="Available Sizes" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((val) => (
                    <Chip key={val} label={val} size="small" />
                  ))}
                </Box>
              )}
            >
              {SIZES.map((size) => (
                <MenuItem key={size} value={size}>
                  <Checkbox checked={formData.sizes.indexOf(size) > -1} />
                  <ListItemText primary={size} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Image URL"
            fullWidth
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            helperText="Enter a publicly accessible image URL"
          />

          {formData.image && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">Preview:</Typography>
              <Box
                component="img"
                src={formData.image}
                alt="Preview"
                sx={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 2, border: '1px solid #ccc' }}
                onError={(e: any) => {
                  e.target.src = 'https://placehold.co/100x100?text=Invalid+Image';
                }}
              />
            </Box>
          )}

          <TextField
            label="Description *"
            multiline
            rows={3}
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              color="success"
            />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formData.inStock ? 'In Stock (Available for purchase)' : 'Out of Stock'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormDialog;
