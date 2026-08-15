import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { StatCard } from '../components/StatCard';
import { dashboardAPI } from '../services/api';
import type { DashboardData } from '../types/dashboard';

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!dashboardData) {
    return <Alert severity="info">No hay datos disponibles</Alert>;
  }

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
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Ingresos Totales"
            value={dashboardData.totalIncome}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="#10b981"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Gastos Totales"
            value={dashboardData.totalExpense}
            icon={<TrendingDownIcon sx={{ fontSize: 40 }} />}
            color="#ef4444"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Balance"
            value={dashboardData.balance}
            icon={<AccountBalanceIcon sx={{ fontSize: 40 }} />}
            color={dashboardData.balance >= 0 ? '#3b82f6' : '#f59e0b'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Transacciones"
            value={dashboardData.transactionCount}
            format={(v) => v.toString()}
            color="#8b5cf6"
            icon={<ReceiptLongIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Transacciones Recientes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell align="center">Tipo</TableCell>
                    <TableCell align="left">Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentTransactions.length > 0 ? (
                    [...dashboardData.recentTransactions]
                      .sort((a, b) => {
                        const aTime = new Date(a.createdAt ?? a.date).getTime();
                        const bTime = new Date(b.createdAt ?? b.date).getTime();
                        return bTime - aTime;
                      })
                      .map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>{transaction.description}</TableCell>
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        No hay transacciones recientes
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Gastos por Categoría
            </Typography>
            <Box>
              {Object.entries(dashboardData.expensesByCategory).length > 0 ? (
                Object.entries(dashboardData.expensesByCategory).map(([category, amount]) => (
                  <Box
                    key={category}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <Typography variant="body2">{category}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ef4444' }}>
                      {formatCurrency(amount)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No hay gastos registrados
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
