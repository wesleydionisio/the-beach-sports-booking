import React, { useState } from 'react';
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
  Box,
  Typography
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Block,
  SportsTennis,
  AttachMoney
} from '@mui/icons-material';

// Dados mockados
const mockCourts = [
  {
    id: 1,
    nome: 'Quadra 1',
    esportes: ['Beach Tennis', 'Vôlei de Praia'],
    status: 'active',
    valorHora: 120.00,
    descricao: 'Quadra oficial de beach tennis',
    dimensoes: '16m x 8m',
    superficie: 'Areia',
    cobertura: true
  },
  {
    id: 2,
    nome: 'Quadra 2',
    esportes: ['Futevôlei', 'Vôlei de Praia'],
    status: 'maintenance',
    valorHora: 100.00,
    descricao: 'Quadra de vôlei e futevôlei',
    dimensoes: '18m x 9m',
    superficie: 'Areia',
    cobertura: false
  },
  {
    id: 3,
    nome: 'Quadra 3',
    esportes: ['Beach Tennis'],
    status: 'active',
    valorHora: 150.00,
    descricao: 'Quadra premium de beach tennis',
    dimensoes: '16m x 8m',
    superficie: 'Areia',
    cobertura: true
  }
];

const statusConfig = {
  active: { label: 'Ativa', color: 'success' },
  maintenance: { label: 'Em Manutenção', color: 'warning' },
  inactive: { label: 'Inativa', color: 'error' }
};

const CourtsTable = () => {
  const [courts, setCourts] = useState(mockCourts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Esportes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Valor da Hora</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Dimensões</TableCell>
              <TableCell>Superfície</TableCell>
              <TableCell>Cobertura</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((court) => (
              <TableRow key={court.id}>
                <TableCell>{court.nome}</TableCell>
                <TableCell>{court.esportes.join(', ')}</TableCell>
                <TableCell>
                  <Chip label={statusConfig[court.status].label} color={statusConfig[court.status].color} />
                </TableCell>
                <TableCell>{court.valorHora}</TableCell>
                <TableCell>{court.descricao}</TableCell>
                <TableCell>{court.dimensoes}</TableCell>
                <TableCell>{court.superficie}</TableCell>
                <TableCell>{court.cobertura ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <Menu>
                    <MenuItem>
                      <ListItemIcon>
                        <Edit />
                      </ListItemIcon>
                      <ListItemText>Editar</ListItemText>
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <Delete />
                      </ListItemIcon>
                      <ListItemText>Excluir</ListItemText>
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={courts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CourtsTable; 