import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from '@mui/material';

// Dados mockados
const transactions = [
  {
    id: 1,
    data: '2024-03-20',
    cliente: 'João Silva',
    tipo: 'payment',
    metodo: 'PIX',
    valor: 120.00,
    status: 'completed'
  },
  {
    id: 2,
    data: '2024-03-19',
    cliente: 'Maria Santos',
    tipo: 'payment',
    metodo: 'Cartão de Crédito',
    valor: 180.00,
    status: 'pending'
  },
  // ... mais transações
];

const statusConfig = {
  completed: { label: 'Concluído', color: 'success' },
  pending: { label: 'Pendente', color: 'warning' },
  failed: { label: 'Falhou', color: 'error' },
  refunded: { label: 'Reembolsado', color: 'default' }
};

const TransactionsTable = ({ tabIndex }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.data)}</TableCell>
                <TableCell>{transaction.cliente}</TableCell>
                <TableCell>{transaction.tipo}</TableCell>
                <TableCell>{transaction.metodo}</TableCell>
                <TableCell>{formatCurrency(transaction.valor)}</TableCell>
                <TableCell>
                  <Chip label={statusConfig[transaction.status].label} color={statusConfig[transaction.status].color} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      />
    </>
  );
};

export default TransactionsTable; 