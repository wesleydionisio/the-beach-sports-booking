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
  Tooltip,
  Box
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import dayjs from 'dayjs';

const UsersTable = ({ users, onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleLabel = (role) => {
    const roles = {
      'admin': 'Administrador',
      'user': 'Cliente'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'error',
      'user': 'primary'
    };
    return colors[role] || 'default';
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="center">Total Agendamentos</TableCell>
              <TableCell>Data Cadastro</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.totalAgendamentos || 0}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {dayjs(user.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell align="center">
                    <Box>
                      <Tooltip title="Editar usuário">
                        <IconButton 
                          size="small"
                          onClick={() => onEdit(user)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count}`
        }
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
};

export default UsersTable; 