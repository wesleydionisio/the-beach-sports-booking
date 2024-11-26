export const metricsData = {
  today: {
    bookingsCount: 12,
    pendingPayments: 3,
    revenue: 850.00,
    occupancyRate: 75
  },
  overview: {
    totalBookings: 156,
    monthlyRevenue: 12500.00,
    futureBookings: 45,
    canceledBookings: 8
  },
  recentBookings: [
    {
      id: 1,
      customer: "João Silva",
      court: "Quadra 1",
      date: "2024-03-20",
      time: "19:00",
      sport: "Beach Tennis",
      status: "confirmed",
      value: 120.00
    },
    {
      id: 2,
      customer: "Maria Santos",
      court: "Quadra 2",
      date: "2024-03-20",
      time: "20:00",
      sport: "Vôlei de Praia",
      status: "pending",
      value: 100.00
    },
    {
      id: 3,
      customer: "Pedro Oliveira",
      court: "Quadra 3",
      date: "2024-03-21",
      time: "18:00",
      sport: "Futevôlei",
      status: "completed",
      value: 90.00
    },
    {
      id: 4,
      customer: "Ana Costa",
      court: "Quadra 1",
      date: "2024-03-22",
      time: "19:00",
      sport: "Beach Tennis",
      status: "confirmed",
      value: 120.00
    }
  ]
}; 