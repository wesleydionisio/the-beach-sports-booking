export const glowEffect = (theme) => ({
  boxShadow: `0 0 15px ${theme.palette.primary.main}40`, // 40 é a opacidade em hex
  transition: 'all 0.3s ease-in-out'
}); 