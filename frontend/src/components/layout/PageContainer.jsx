import { Box } from '@mui/material';
import { HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '../../constants/layout';

const PageContainer = ({ children, withHeader = true }) => {
  return (
    <Box
      sx={{
        pt: withHeader ? {
          xs: `${MOBILE_HEADER_HEIGHT}px`,
          md: `${HEADER_HEIGHT}px`
        } : 0,
        minHeight: '100vh'
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer; 