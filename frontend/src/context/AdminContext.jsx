const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Métodos para gerenciar estado global do admin
  const refreshDashboard = async () => {
    // Atualizar dados do dashboard
  };

  const value = {
    dashboardData,
    loading,
    error,
    refreshDashboard
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 