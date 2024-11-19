import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

const CourtCard = ({ court }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/booking/${court._id}`);
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={court.foto_principal || 'https://via.placeholder.com/150'}
        alt={court.nome}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {court.nome}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleNavigate}>
          Reservar
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourtCard;