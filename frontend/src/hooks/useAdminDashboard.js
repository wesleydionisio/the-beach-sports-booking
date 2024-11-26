const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    schedules: [],
    payments: [],
    charts: {
      schedules: [],
      revenue: []
    }
  });

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  // Atualização em tempo real
  useEffect(() => {
    const socket = io('/admin');
    
    socket.on('dashboard-update', (data) => {
      setDashboardData(prev => ({...prev, ...data}));
    });

    return () => socket.disconnect();
  }, []);

  return { dashboardData, fetchDashboardData };
}; 