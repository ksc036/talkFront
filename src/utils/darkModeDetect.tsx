import { useTheme } from '@wapl/ui';

const isDarkMode = () => {
  const theme = useTheme();

  return theme.Color.Background[0] !== '#FFFFFF';
};

export default isDarkMode;
