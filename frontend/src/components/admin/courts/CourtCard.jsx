import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActions,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Event as EventIcon,
  Today as TodayIcon
} from '@mui/icons-material';

const CourtCard = React.memo(({ court, onEdit }) => {
  console.log('Dados recebidos no CourtCard:', {
    id: court._id,
    nome: court.nome,
    bookings_today: court.bookings_today,
    bookings_month: court.bookings_month
  });

  const defaultImage = '/images/court-placeholder.jpg'; // Crie uma imagem padrão

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={court.foto_principal || defaultImage}
        alt={court.nome}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          {court.nome}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {court.descricao}
        </Typography>

        <Box sx={{ mt: 2, mb: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {court.esportes_permitidos.map((esporte) => (
              <Chip
                key={esporte._id}
                label={esporte.nome}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Tooltip title="Agendamentos hoje">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TodayIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {court.bookings_today || 0}
                </Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Agendamentos este mês">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {court.bookings_month || 0}
                </Typography>
              </Box>
            </Tooltip>
          </Stack>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="subtitle1" color="primary">
          R$ {court.preco_por_hora}/hora
        </Typography>
        
        <IconButton 
          size="small" 
          color="primary"
          onClick={() => onEdit(court)}
        >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
});

CourtCard.displayName = 'CourtCard';

export default CourtCard; 