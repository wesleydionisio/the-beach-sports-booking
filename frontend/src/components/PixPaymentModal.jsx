import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Button,
    CircularProgress,
    IconButton,
    Alert,
    Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from '../api/apiService';

const PixPaymentModal = ({ open, onClose, bookingId, onPaymentSuccess }) => {
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [polling, setPolling] = useState(null);
    const [pollingCount, setPollingCount] = useState(0);
    const MAX_POLLING_ATTEMPTS = 60; // 5 minutos (5s * 60)

    useEffect(() => {
        if (open && bookingId) {
            createPayment();
        }
        return () => stopPolling();
    }, [open, bookingId]);

    const createPayment = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.post('/payments/create', {
                bookingId
            });

            if (response.data.success) {
                setPaymentData(response.data.data);
                startPolling(response.data.data.id);
            } else {
                throw new Error(response.data.message || 'Erro ao criar pagamento');
            }
        } catch (error) {
            console.error('Erro ao criar pagamento:', error);
            setError('Erro ao gerar pagamento PIX. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (paymentId) => {
        const poll = setInterval(async () => {
            try {
                const response = await axios.get(`/payments/status/${paymentId}`);
                
                if (response.data.status === 'approved') {
                    stopPolling();
                    onPaymentSuccess();
                    onClose();
                }
            } catch (error) {
                console.error('Erro ao verificar status:', error);
                // Não parar o polling em caso de erro
            }
        }, 5000); // Verificar a cada 5 segundos

        setPolling(poll);
    };

    const stopPolling = () => {
        if (polling) {
            clearInterval(polling);
            setPolling(null);
            setPollingCount(0);
        }
    };

    // Limpar polling ao desmontar
    useEffect(() => {
        return () => stopPolling();
    }, []);

    const handleCopyPixCode = () => {
        const pixCode = paymentData?.point_of_interaction?.transaction_data?.qr_code;
        if (pixCode) {
            navigator.clipboard.writeText(pixCode);
            setSnackbar({
                open: true,
                message: 'Código PIX copiado com sucesso!'
            });
        }
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={() => onClose(false)}
                maxWidth="sm" 
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Pagamento PIX</Typography>
                        <IconButton onClick={() => onClose(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert 
                            severity="error" 
                            action={
                                <Button color="inherit" size="small" onClick={createPayment}>
                                    Tentar Novamente
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    ) : paymentData && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Valor: {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(paymentData.transaction_amount)}
                            </Typography>

                            <Box sx={{ my: 2 }}>
                                <img 
                                    src={`data:image/jpeg;base64,${paymentData.point_of_interaction.transaction_data.qr_code_base64}`}
                                    alt="QR Code PIX"
                                    style={{ width: '100%', maxWidth: 250 }}
                                />
                            </Box>

                            <Button
                                variant="outlined"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopyPixCode}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Copiar código PIX
                            </Button>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                message={snackbar.message}
            />
        </>
    );
};

export default PixPaymentModal; 