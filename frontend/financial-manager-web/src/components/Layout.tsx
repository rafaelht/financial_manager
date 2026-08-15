import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Transacciones', path: '/transactions' },
    { label: 'Categorías', path: '/categories' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} component={RouterLink} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1f2937' }}>
        <Toolbar sx={{ maxWidth: '1280px', width: '100%', margin: '0 auto', px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 0.5 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Financial Manager
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {menuItems.map((item) => (
              <RouterLink
                key={item.path}
                to={item.path}
                style={{ color: 'white', textDecoration: 'none', marginRight: '20px', fontWeight: 600 }}
              >
                {item.label}
              </RouterLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        {drawer}
      </Drawer>

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          borderTop: '1px solid #ddd',
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © 2026 Financial Manager. By Rafael Hilario Torres.
        </Typography>
      </Box>
    </Box>
  );
};
