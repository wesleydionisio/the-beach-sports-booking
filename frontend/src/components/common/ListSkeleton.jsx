import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { fadeInUp } from '../../styles/animations';

const ListSkeleton = ({ 
  items = 4, 
  renderItem,
  spacing = 1,
  padding = 1
}) => (
  <Stack spacing={spacing} sx={{ p: padding }}>
    {[...Array(items)].map((_, index) => (
      <Box
        key={index}
        sx={{
          p: 2,
          borderRadius: 1,
          border: '1px solid #f1f1f1',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          animation: `${fadeInUp} 0.3s ease-out forwards`,
          animationDelay: `${index * 0.05}s`,
          opacity: 0,
        }}
      >
        {renderItem ? renderItem(index) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box>
              <Skeleton 
                variant="text" 
                width={120} 
                height={24}
                animation="wave"
              />
              <Skeleton 
                variant="text" 
                width={80} 
                height={20}
                animation="wave"
              />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1 
            }}>
              <Skeleton 
                variant="text" 
                width={100} 
                height={20}
                animation="wave"
              />
              <Skeleton 
                variant="rounded"
                width={90}
                height={32}
                animation="wave"
              />
            </Box>
          </Box>
        )}
      </Box>
    ))}
  </Stack>
);

export default ListSkeleton; 