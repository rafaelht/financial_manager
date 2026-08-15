import { Box, Card, CardContent, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
  format?: (value: number) => string;
}

const formatDollarValue = (value: number) => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  return value < 0 ? `-$${formatted}` : `$${formatted}`;
};

export const StatCard = ({
  title,
  value,
  icon,
  color = '#667eea',
  format = formatDollarValue,
}: StatCardProps) => {
  return (
    <Card
      sx={{
        backgroundColor: color,
        color: 'white',
        height: '100%',
        borderRadius: 2,
        boxShadow: 'none',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="inherit" variant="body2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
              {format(value)}
            </Typography>
          </Box>
          {icon && <Box sx={{ fontSize: 40 }}>{icon}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
};
