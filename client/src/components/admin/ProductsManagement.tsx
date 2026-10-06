import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useProducts } from '../../contexts/ProductContext';
import { Product } from '../../types/Product';
import ProductFormDialog from './ProductFormDialog';
import DeleteProductDialog from './DeleteProductDialog';

const CATEGORIES = ['Casual', 'Winter', 'Formal', 'Sports'];

interface ProductsManagementProps {
  onNotify: (message: string, severity: 'success' | 'error' | 'info') => void;
}

export const ProductsManagement: React.FC<ProductsManagementProps> = ({ onNotify }) => {
  const { products, loading, addProduct, editProduct, removeProduct } = useProducts();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === 'ALL' || p.category?.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormDialogOpen(true);
  };

  const handleSaveProduct = async (formData: Omit<Product, 'productId'>) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        await editProduct(editingProduct.productId, formData);
        onNotify(`Product "${formData.name}" updated successfully`, 'success');
      } else {
        await addProduct(formData);
        onNotify(`Product "${formData.name}" created successfully`, 'success');
      }
      setFormDialogOpen(false);
    } catch (err: any) {
      onNotify(err?.response?.data?.detail || 'Failed to save product', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      await editProduct(product.productId, { inStock: !product.inStock });
      onNotify(`Product stock set to ${!product.inStock ? 'In Stock' : 'Out of Stock'}`, 'success');
    } catch (err: any) {
      onNotify(err?.response?.data?.detail || 'Failed to update stock', 'error');
    }
  };

  const handleOpenDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setActionLoading(true);
    try {
      await removeProduct(productToDelete.productId);
      onNotify(`Product "${productToDelete.name}" deleted successfully`, 'success');
      setDeleteDialogOpen(false);
    } catch (err: any) {
      onNotify(err?.response?.data?.detail || 'Failed to delete product', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      {/* Top Filter & Action Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          label="Search Products"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260, flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ fontWeight: 'bold' }}
        >
          Add Product
        </Button>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Chip label={`Total: ${products.length}`} variant="outlined" />
          <Chip label={`In Stock: ${products.filter((p) => p.inStock).length}`} color="success" variant="outlined" />
          <Chip label={`Out of Stock: ${products.filter((p) => !p.inStock).length}`} color="error" variant="outlined" />
        </Box>
      </Paper>

      {/* Products Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No products match your filter criteria.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 750 }}>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Name & Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Sizes</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Stock Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.productId} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        width: 55,
                        height: 55,
                        objectFit: 'cover',
                        borderRadius: 1.5,
                        border: '1px solid #ddd'
                      }}
                      onError={(e: any) => {
                        e.target.src = 'https://placehold.co/100x100?text=No+Image';
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }} noWrap>
                      {product.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.category || 'Standard'}
                      size="small"
                      sx={{ bgcolor: 'secondary.light', color: 'secondary.main', fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {product.sizes?.map((size) => (
                        <Chip key={size} label={size} size="small" variant="outlined" />
                      )) || <Chip label="M" size="small" variant="outlined" />}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.05rem' }}>
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={product.inStock}
                        onChange={() => handleToggleStock(product)}
                        color="success"
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 'bold',
                          color: product.inStock ? 'success.main' : 'error.main'
                        }}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Product">
                      <IconButton color="primary" onClick={() => handleOpenEdit(product)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Product">
                      <IconButton color="error" onClick={() => handleOpenDelete(product)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Form Dialog */}
      <ProductFormDialog
        open={formDialogOpen}
        product={editingProduct}
        loading={actionLoading}
        onClose={() => setFormDialogOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Delete Dialog */}
      <DeleteProductDialog
        open={deleteDialogOpen}
        product={productToDelete}
        loading={actionLoading}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default ProductsManagement;
