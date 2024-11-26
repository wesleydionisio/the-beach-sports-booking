const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminHeader />
        <Outlet />
      </Box>
    </Box>
  );
}; 