import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { categoryAPI } from '../services/api';
import type { Category, CreateCategoryDto } from '../types/category';

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryDto>({ name: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryAPI.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name });
    } else {
      setEditingCategory(null);
      setFormData({ name: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'El nombre es requerido', type: 'error' });
      return;
    }

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory.id, formData);
        setSnackbar({ open: true, message: 'Categoría actualizada', type: 'success' });
      } else {
        await categoryAPI.create(formData);
        setSnackbar({ open: true, message: 'Categoría creada', type: 'success' });
      }
      handleCloseDialog();
      await fetchCategories();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al guardar', type: 'error' });
      console.error(err);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCategory) {
      try {
        await categoryAPI.delete(selectedCategory.id);
        setSnackbar({ open: true, message: 'Categoría eliminada', type: 'success' });
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
        await fetchCategories();
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al eliminar', type: 'error' });
        console.error(err);
      }
    }
  };

  if (loading && categories.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Categorías
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#1f2937', boxShadow: 'none' }}
        >
          Nueva Categoría
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(category)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                  No hay categorías
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar esta categoría?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          top: 72,
          right: 24,
          left: 'auto',
          '& .MuiSnackbarContent-root': {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          variant="filled"
          sx={{
            width: '100%',
            backgroundColor: snackbar.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: '#111827',
            border: '1px solid rgba(17, 24, 39, 0.08)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
