import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Typography,
} from '@mui/material';

const parseAmountInput = (value: string) => {
  if (value.trim() === '') {
    return 0;
  }

  const normalized = value.replace(/\s+/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};
import type { Transaction, CreateTransactionDto } from '../types/transaction';
import type { Category } from '../types/category';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDto) => Promise<void>;
  categories: Category[];
  loading?: boolean;
  initialData?: Transaction;
  title?: string;
}

const normalizeTransactionType = (value: unknown): 'Income' | 'Expense' => {
  if (value === 'Income' || value === 'Expense') {
    return value;
  }

  if (value === 0 || value === '0') {
    return 'Expense';
  }

  if (value === 1 || value === '1') {
    return 'Income';
  }

  return 'Expense';
};

export const TransactionForm = ({
  onSubmit,
  categories,
  loading = false,
  initialData,
  title = 'Nueva Transacción',
}: TransactionFormProps) => {
  const [amountText, setAmountText] = useState<string>(
    initialData ? String(initialData.amount) : ''
  );
  const [formData, setFormData] = useState<CreateTransactionDto>(
    initialData
      ? {
          description: initialData.description,
          amount: initialData.amount,
          type: normalizeTransactionType(initialData.type),
          date: initialData.date.split('T')[0],
          categoryId: initialData.categoryId,
        }
      : {
          description: '',
          amount: 0,
          type: 'Expense',
          date: new Date().toISOString().split('T')[0],
          categoryId: categories[0]?.id ?? 0,
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const target = e.target as HTMLInputElement & { name?: string; value?: string | number };
    const { name, value } = target;

    if (!name) return;

    if (name === 'amount') {
      const stringValue = String(value);
      setAmountText(stringValue);
      
      const parsed = parseAmountInput(stringValue);
      setFormData((prev) => ({
        ...prev,
        amount: parsed,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (event: { target: { name?: string; value: string | number } }) => {
    const { name, value } = event.target;

    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Monto"
              name="amount"
              type="text"
              inputMode="decimal"
              value={amountText}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              disabled={loading}
              slotProps={{
                htmlInput: {
                  inputMode: 'decimal',
                  pattern: '[0-9]*[.,]?[0-9]*',
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleSelectChange}
                label="Tipo"
                disabled={loading}
              >
                <MenuItem value="Income">Ingreso</MenuItem>
                <MenuItem value="Expense">Gasto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Fecha"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
              slotProps={{ inputLabel: { shrink: true } }}
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.categoryId}>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleSelectChange}
                label="Categoría"
                disabled={loading}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && <Typography color="error" variant="caption">{errors.categoryId}</Typography>}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#1f2937',
                  boxShadow: 'none',
                }}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
