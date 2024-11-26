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
  ListItemText
} from '@mui/material';
import { Edit, Delete, MoreVert, Block } from '@mui/icons-material';

// Dados mockados
const mockUsers = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    status: 'active',
    tipo: 'cliente'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(11) 98888-8888',
    status: 'inactive',
    tipo: 'admin'
  }
];

const UsersTable = ({ onEdit }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState(mockUsers);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (user) => {
    onEdit(user);
  };

  const handleDelete = (user) => {
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const handleBlock = (user) => {
    setUsers(users.map((u) => (u.id === user.id ? { ...u, status: 'blocked' } : u)));
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
              <TableCell>Status</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telefone}</TableCell>
                  <TableCell>
                    <Chip label={user.status} color={user.status === 'active' ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>{user.tipo}</TableCell>
                  <TableCell>
                    <Menu>
                      <MenuItem onClick={() => handleEdit(user)}>
                        <ListItemIcon>
                          <Edit />
                        </ListItemIcon>
                        <ListItemText>Editar</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(user)}>
                        <ListItemIcon>
                          <Delete />
                        </ListItemIcon>
                        <ListItemText>Excluir</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => handleBlock(user)}>
                        <ListItemIcon>
                          <Block />
                        </ListItemIcon>
                        <ListItemText>Bloquear</ListItemText>
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
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default UsersTable; 