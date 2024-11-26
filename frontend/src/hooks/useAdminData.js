const useAdminData = () => {
  const queryClient = useQueryClient();

  return useQuery(['adminDashboard'], fetchDashboardData, {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 30 * 60 * 1000 // 30 minutos
  });
}; 