import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CardActions,
  Chip
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const CourtCard = ({ court, onEdit }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={court.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}
        alt={court.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {court.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {court.description || 'Sem descrição disponível'}
        </Typography>
        
        {court.sport && (
          <Box sx={{ mb: 1 }}>
            {court.sport.split(',').map((sport, index) => (
              <Chip 
                key={index}
                label={sport.trim()}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        )}

        {court.pricePerHour > 0 && (
          <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
            Valor: R$ {court.pricePerHour.toFixed(2)}/hora
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(court.id)}
        >
          Editar
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourtCard; 