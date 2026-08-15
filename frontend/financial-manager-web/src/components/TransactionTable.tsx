import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Box,
  TextField,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { Transaction } from '../types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: number) => Promise<void>;
  loading?: boolean;
}

export const TransactionTable = ({
  transactions,
  onEdit,
  onDelete,
  loading = false,
}: TransactionTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sortedTransactions = [...transactions].sort((a, b) => {
    const aTime = new Date(a.createdAt ?? a.date).getTime();
    const bTime = new Date(b.createdAt ?? b.date).getTime();
    return bTime - aTime;
  });

  const filteredTransactions = sortedTransactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTransaction && onDelete) {
      await onDelete(selectedTransaction.id);
      setDeleteDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCurrency = (amount: number) => {
    const numeric = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    return amount < 0 ? `-$${numeric}` : `$${numeric}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX');
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Buscar transacción..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          size="small"
          fullWidth
          disabled={loading}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell align="left">Descripción</TableCell>
              <TableCell align="left">Categoría</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell align="center">Tipo</TableCell>
              <TableCell align="left">Fecha</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.categoryName || 'N/A'}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={transaction.type === 'Income' ? 'Ingreso' : 'Gasto'}
                      color={transaction.type === 'Income' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => onEdit?.(transaction)}
                      disabled={loading}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(transaction)}
                      disabled={loading}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No hay transacciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar esta transacción?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={loading}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
