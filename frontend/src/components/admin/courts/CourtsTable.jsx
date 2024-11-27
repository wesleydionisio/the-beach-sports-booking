import React, { useState, useEffect } from 'react';
import axios from '../../../api/apiService';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const statusConfig = {
  active: { label: 'Ativa', color: 'success' },
  maintenance: { label: 'Em Manutenção', color: 'warning' },
  inactive: { label: 'Inativa', color: 'error' }
};

const CourtsTable = ({ onEditCourt }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCourts = async () => {
    try {
      const response = await axios.get('/courts');
      setCourts(response.data);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar quadras', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleDeleteCourt = async (courtId) => {
    try {
      await axios.delete(`/courts/${courtId}`);
      enqueueSnackbar('Quadra excluída com sucesso', { variant: 'success' });
      fetchCourts(); // Recarrega a lista
    } catch (error) {
      enqueueSnackbar('Erro ao excluir quadra', { variant: 'error' });
    }
  };

  const handleMenuClick = (event, court) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourt(court);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourt(null);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Esportes</TableCell>
              <TableCell>Duração Padrão</TableCell>
              <TableCell>Preço/Hora</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((court) => (
                <TableRow key={court._id}>
                  <TableCell>{court.nome}</TableCell>
                  <TableCell>
                    {court.esportes_permitidos.map(esporte => 
                      <Chip 
                        key={esporte._id} 
                        label={esporte.nome} 
                        size="small" 
                        sx={{ mr: 0.5 }} 
                      />
                    )}
                  </TableCell>
                  <TableCell>{court.duracao_padrao} minutos</TableCell>
                  <TableCell>R$ {court.preco_por_hora}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, court)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={courts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          onEditCourt(selectedCourt);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteCourt(selectedCourt._id);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default CourtsTable; 