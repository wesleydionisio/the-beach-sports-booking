import { Typography } from '@mui/material';

const SectionLabel = ({ children }) => (
  <Typography 
    variant="subtitle2" 
    color="text.secondary" 
    gutterBottom
    sx={{ 
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1px'
    }}
  >
    {children}
  </Typography>
);

export default SectionLabel; 