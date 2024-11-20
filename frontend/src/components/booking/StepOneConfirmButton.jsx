import { Button, Stack, Typography, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const StepOneConfirmButton = ({ selectedDate, selectedSlot, price, onClick }) => {
  // Formata a data para pt-BR
  const formattedDate = dayjs(selectedDate).locale('pt-br').format('DD [de] MMMM');

  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={onClick}
      sx={{
        py: 2,
        px: { xs: 2, md: 3 },
        fontSize: '1.1rem',
        position: { xs: 'fixed', md: 'static' },
        bottom: { xs: 0, md: 'auto' },
        left: { xs: 0, md: 'auto' },
        right: { xs: 0, md: 'auto' },
        width: '100%',
        maxWidth: { xs: '100vw', md: '100%' },
        borderRadius: { 
          xs: '12px 12px 0 0',
          md: 1 
        },
        mb: { xs: 0, md: 2 },
        zIndex: 1000,
      }}
    >
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '100%',
      }}>
        {/* Data e Horário */}
        <Stack spacing={0} alignItems="flex-start">
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.8)',
              textTransform: 'capitalize',
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            {formattedDate}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600,
              color: 'white',
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            {selectedSlot.horario_inicio} - {selectedSlot.horario_fim}
          </Typography>
        </Stack>

        {/* Valor e Ícone */}
        <Stack 
          direction="row" 
          spacing={1}
          alignItems="center"
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600,
              color: 'white',
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}
          >
            R$ {price}
          </Typography>
          <ArrowForwardIcon sx={{ 
            color: 'white',
            fontSize: { xs: '1.25rem', md: '1.5rem' }
          }} />
        </Stack>
      </Box>
    </Button>
  );
};

export default StepOneConfirmButton; 