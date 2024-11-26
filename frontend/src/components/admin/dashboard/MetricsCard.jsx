const MetricsCard = ({ title, value, icon, trend }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
        {icon}
        {trend && (
          <Typography color={trend > 0 ? 'success.main' : 'error.main'}>
            {trend}%
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}; 