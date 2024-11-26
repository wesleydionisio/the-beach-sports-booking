const SchedulesList = ({ schedules }) => {
  return (
    <List>
      {schedules.map((schedule) => (
        <ListItem key={schedule.id}>
          <ListItemText
            primary={schedule.customerName}
            secondary={schedule.dateTime}
          />
          <Chip label={schedule.status} />
        </ListItem>
      ))}
    </List>
  );
}; 