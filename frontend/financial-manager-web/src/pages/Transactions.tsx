import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionTable } from '../components/TransactionTable';
import { transactionAPI, categoryAPI } from '../services/api';
import type { Transaction, CreateTransactionDto } from '../types/transaction';
import type { Category } from '../types/category';

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsData, categoriesData] = await Promise.all([
        transactionAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setTransactions(
        [...transactionsData].sort((a, b) => {
          const aTime = new Date(a.createdAt ?? a.date).getTime();
          const bTime = new Date(b.createdAt ?? b.date).getTime();
          return bTime - aTime;
        })
      );
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreateTransactionDto) => {
    try {
      if (editingTransaction) {
        await transactionAPI.update(editingTransaction.id, data);
        setSnackbar({ open: true, message: 'Transacción actualizada', type: 'success' });
      } else {
        await transactionAPI.create(data);
        setSnackbar({ open: true, message: 'Transacción creada', type: 'success' });
      }
      setOpenForm(false);
      setEditingTransaction(null);
      await fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al guardar', type: 'error' });
      console.error(err);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setOpenForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await transactionAPI.delete(id);
      setSnackbar({ open: true, message: 'Transacción eliminada', type: 'success' });
      await fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al eliminar', type: 'error' });
      console.error(err);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingTransaction(null);
  };

  if (loading && transactions.length === 0) {
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
          Transacciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTransaction(null);
            setOpenForm(true);
          }}
          sx={{ backgroundColor: '#1f2937', boxShadow: 'none' }}
        >
          Nueva Transacción
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TransactionForm
            onSubmit={handleFormSubmit}
            categories={categories}
            loading={loading}
            initialData={editingTransaction || undefined}
            title=""
          />
        </DialogContent>
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
